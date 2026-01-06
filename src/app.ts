import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { AppRoute } from "@app/types";
import compression from "compression";
import logger from "@app/libs/logger";
import cookieParser from "cookie-parser";
import { envs } from "@app/config/envs.validate";
import express, { type Application } from "express";
import { errorHandlerMiddleware } from "@app/middlewares/error.handler.middleware";
import { AppDataSource } from "./database/data-source";
import hpp from "hpp";

/**
 * Main application class for initializing and running the Express server.
 * Handles middleware setup, route registration, error handling, database connection,
 * and graceful shutdown procedures.
 */
export class App {
    /**
     * The port on which the server will listen.
     */
    readonly port: number;
    /**
     * The Express application instance.
     */
    readonly app: Application;
    /**
     * Array of application routes to be registered.
     */
    readonly routes: AppRoute[] = [];

    /**
     * Constructs the App instance.
     * @param routes Array of AppRoute objects to register with the app.
     */
    constructor(routes: AppRoute[]) {
        this.routes = routes;
        this.app = express();
        this.port = envs.PORT;
    }

    /**
     * The HTTP server instance (set after listen).
     */
    private server?: import('http').Server;

    /**
     * Starts the application: connects to DB, sets up middleware, routes, error handling, and listeners.
     */
    readonly start = async () => {
        // 1. Connect to the database
        await AppDataSource.initialize();
        // 2. Register standard middlewares
        this.setStandardMiddlewares();
        // 3. Register application routes
        this.setRoutes();
        // 4. Register catch-all 404 route before error handler
        this.setNotFoundRoute();
        // 5. Register global error handler
        this.setGlobalErrorHandler();
        // 6. Start the HTTP server
        this.listen();
        // 7. Setup graceful shutdown for process signals
        this.setupGracefulShutdown();
        // 8. Setup handlers for unhandled errors
        this.setupProcessErrorHandlers();
    };
    /**
     * Registers a best-practice catch-all 404 route using app.all('*').
     * Ensures unknown routes return a consistent 404 response.
     */
    private readonly setNotFoundRoute = () => {
        this.app.all('*', (req: Request, res: Response) => {
            res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                success: false,
                message: `${req.originalUrl} not found`,
            });
        });
    };

    /**
     * Sets up graceful shutdown on process signals (SIGINT, SIGTERM, SIGQUIT in dev).
     * Ensures resources are cleaned up before exit.
     */
    private readonly setupGracefulShutdown = () => {
        process.on('SIGINT', () => this.shutdown('SIGINT'));
        process.on('SIGTERM', () => this.shutdown('SIGTERM'));
        // SIGQUIT is typically used in development for manual shutdown
        if (process.env.NODE_ENV === 'development') {
            process.on('SIGQUIT', () => this.shutdown('SIGQUIT'));
        }
    };

    /**
     * Sets up handlers for unhandled promise rejections and uncaught exceptions.
     * Ensures the app logs the error and shuts down gracefully.
     */
    private readonly setupProcessErrorHandlers = () => {
        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason: any) => {
            logger.error('Unhandled Rejection:', reason);
            this.shutdown('unhandledRejection', reason);
        });
        // Handle uncaught exceptions
        process.on('uncaughtException', (error: Error) => {
            logger.error('Uncaught Exception:', error);
            this.shutdown('uncaughtException', error);
        });
    };

    /**
     * Gracefully shuts down the server and database connection on fatal errors or process signals.
     * @param type The type of shutdown trigger (signal or error type)
     * @param error Optional error object for logging
     */
    private readonly shutdown = async (type: string, error?: any) => {
        logger.error(`Fatal error (${type}):`, error);
        try {
            // Close HTTP server if running
            if (this.server) {
                this.server.close(() => {
                    logger.info('HTTP server closed due to fatal error.');
                });
            }
            // Close database connection if initialized
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
                logger.info('Database connection closed due to fatal error.');
            }
        } catch (err) {
            logger.error('Error during fatal shutdown:', err);
        } finally {
            // Always exit with error code
            process.exit(1);
        }
    };

    /**
     * Registers standard middlewares for security, parsing, logging, and compression.
     * Order of middleware is important for security and performance.
     */
    private readonly setStandardMiddlewares = () => {
        // Enable trust proxy for correct client IPs behind proxies
        this.app.enable('trust proxy');
        // Set security-related HTTP headers
        this.app.use(helmet());
        // Enable CORS for cross-origin requests
        this.app.use(cors());
        // Parse incoming JSON requests
        this.app.use(express.json());
        // Parse URL-encoded payloads
        this.app.use(express.urlencoded({ extended: true }));
        // Parse cookies
        this.app.use(cookieParser());
        // Prevent query params pollution middleware.
        this.app.use(hpp());
        // Enable response compression
        this.app.use(compression());
        // HTTP request logging using morgan, piped to custom logger
        this.app.use(morgan('dev', { stream: { write: (message) => logger.http(message.trim()) } }));
    };

    /**
     * Registers all provided routes under the /api prefix.
     * Keeps API routes organized and versionable.
     */
    private readonly setRoutes = () => {
        this.routes.forEach((route) => {
            this.app.use("/api", route.router);
        });
    };

    /**
     * Registers the global error handler middleware as the last middleware.
     * Ensures all errors are caught and handled consistently.
     */
    private readonly setGlobalErrorHandler = () => {
        this.app.use(errorHandlerMiddleware);
    };

    /**
     * Starts the HTTP server and logs the listening port.
     * Should only be called once all setup is complete.
     */
    private readonly listen = () => {
        this.server = this.app.listen(this.port, () => {
            logger.info("================================");
            logger.info(`Server is listening on ${this.port}`);
            logger.info("================================");
        });
    };
}
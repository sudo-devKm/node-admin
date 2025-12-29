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

export class App {
    readonly port: number;
    readonly app: Application;
    readonly routes: AppRoute[] = [];

    constructor(routes: AppRoute[]) {
        this.routes = routes;
        this.app = express();
        this.port = envs.PORT;
    };

    private server?: import('http').Server;

    readonly start = async () => {
        // connect to database.
        await AppDataSource.initialize();
        // set standard middlewares.
        this.setStandardMiddlewares();
        // set routes.
        this.setRoutes();
        // set global error Handler middleware.
        this.setGlobalErrorHandler();
        // start express server.
        this.listen();
        // setup graceful shutdown
        this.setupGracefulShutdown();
        // handle unhandled rejections and exceptions
        this.setupProcessErrorHandlers();
    };

    private readonly setupGracefulShutdown = () => {
        process.on('SIGINT', () => this.shutdown('SIGINT'));
        process.on('SIGTERM', () => this.shutdown('SIGTERM'));
        if (process.env.NODE_ENV === 'development') {
            process.on('SIGQUIT', () => this.shutdown('SIGQUIT'));
        }
    };

    private readonly setupProcessErrorHandlers = () => {
        // Unhandled Promise Rejection
        process.on('unhandledRejection', (reason: any) => {
            logger.error('Unhandled Rejection:', reason);
            this.shutdown('unhandledRejection', reason);
        });
        // Uncaught Exception
        process.on('uncaughtException', (error: Error) => {
            logger.error('Uncaught Exception:', error);
            this.shutdown('uncaughtException', error);
        });
    };

    private readonly shutdown = async (type: string, error?: any) => {
        logger.error(`Fatal error (${type}):`, error);
        try {
            if (this.server) {
                this.server.close(() => {
                    logger.info('HTTP server closed due to fatal error.');
                });
            }
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
                logger.info('Database connection closed due to fatal error.');
            }
        } catch (err) {
            logger.error('Error during fatal shutdown:', err);
        } finally {
            process.exit(1);
        }
    };

    private readonly setStandardMiddlewares = () => {
        // enable standard proxy.
        this.app.enable('trust proxy');
        // set security headers.
        this.app.use(helmet());
        // set cors.
        this.app.use(cors());
        // set json parser.
        this.app.use(express.json());
        // set url parameter parser.
        this.app.use(express.urlencoded({ extended: true }));
        // set cookie parser.
        this.app.use(cookieParser());
        // set compression.
        this.app.use(compression());
        // set request logger - morgan.
        this.app.use(morgan('dev', { stream: { write: (message) => logger.http(message) } }));
    };

    private readonly setRoutes = () => {
        // set provided routes.
        this.routes.forEach((route) => {
            this.app.use("/api", route.router);
        });
    };

    private readonly setGlobalErrorHandler = () => {
        // set global error handler.
        this.app.use(errorHandlerMiddleware);
    };

    private readonly listen = () => {
        // start express server.
        this.server = this.app.listen(this.port, () => {
            logger.info("================================");
            logger.info(`Server is listening on ${this.port}`);
            logger.info("================================");
        });
    };
}
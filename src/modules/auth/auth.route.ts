import { Router } from "express";
import { AppRoute } from "@app/types";
import authController from "./controllers/auth.controller";
import { RegisterSchema } from "./validation/register.validation";
import { validationSchemaMiddleware } from "@app/middlewares/schema.validation.middleware";
import { LoginSchema } from "./validation/login.validation";
import { authMiddleware } from "@app/middlewares/auth.middleware";
import { ProfileUpdateSchema } from "./validation/profile.validation";
import { UpdatePasswordSchema } from "./validation/updatePassword.validation";

export class AuthRoute implements AppRoute {
    readonly router = Router();
    readonly path = '/auth';

    constructor() {
        this.setAuthRoutes();
    };

    private readonly setAuthRoutes = () => {
        // register account.
        this.router
            .route(`${this.path}/register`)
            .post(
                validationSchemaMiddleware({ body: { schema: RegisterSchema } }),
                authController.register
            );
        // login.
        this.router
            .route(`${this.path}/login`)
            .post(
                validationSchemaMiddleware({ body: { schema: LoginSchema } }),
                authController.login
            );
        // get authenticated user.
        this.router
            .route(`${this.path}/me`)
            .get(
                authMiddleware,
                authController.authenticatedUser
            );
        // logout user.
        this.router
            .route(`${this.path}/logout`)
            .get(
                authMiddleware,
                authController.logout
            );
        // update current user profile.
        this.router
            .route(`${this.path}/profile`)
            .patch(
                validationSchemaMiddleware({ body: { schema: ProfileUpdateSchema } }),
                authMiddleware,
                authController.updateProfile
            );
        // update user password.
        this.router
            .route(`${this.path}/update-password`)
            .patch(
                validationSchemaMiddleware({ body: { schema: UpdatePasswordSchema } }),
                authMiddleware,
                authController.updateCurrentUserPassword
            )
    }
}
import { authMiddleware } from "@app/middlewares/auth.middleware";
import { validationSchemaMiddleware } from "@app/middlewares/schema.validation.middleware";
import { AppRoute } from "@app/types";
import { Router } from "express";
import usersController from "./controllers/user.controller";
import { CreateUserSchema, GetUsersSchema } from "./validation/user.validation";

export class UserRoute implements AppRoute {
    readonly router = Router();
    readonly path = "/users";

    constructor() {
        this.setUserRoutes();
    };

    private readonly setUserRoutes = () => {
        // get users and create user route.
        this.router
            .route(`${this.path}`)
            .get(
                authMiddleware,
                validationSchemaMiddleware({ query: { schema: GetUsersSchema } }),
                usersController.getUsers
            )
            .post(
                authMiddleware,
                validationSchemaMiddleware({ body: { schema: CreateUserSchema } }),
                usersController.createUser
            )
    };
}
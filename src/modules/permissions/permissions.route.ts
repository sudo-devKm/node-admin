import { AppRoute } from "@app/types";
import { Router } from "express";
import permissionsController from "./controllers/permissions.controller";
import { authMiddleware } from "@app/middlewares/auth.middleware";

export class PermissionsRoute implements AppRoute {
    readonly router = Router();
    readonly path = '/permissions';

    constructor() {
        // set permissions routes.
        this.setPermissionsRoutes();
    };

    private readonly setPermissionsRoutes = () => {
        // get all permissions routes.
        this.router
            .route(`${this.path}`)
            .get(authMiddleware, permissionsController.getPermissions)
    };
}
import { validationSchemaMiddleware } from "@app/middlewares/schema.validation.middleware";
import { AppRoute } from "@app/types";
import { Router } from "express";
import { CreateRoleSchema } from "./validation/createRole.validation";
import rolesController from "./controllers/roles.controller";
import { PaginationSchema } from "@app/utils/common.validation";
import { authMiddleware } from "@app/middlewares/auth.middleware";
import { UpdateRoleSchema } from "./validation/updateRole.validation";

export class RolesRoute implements AppRoute {
    readonly router = Router();
    readonly path = '/roles';

    constructor() {
        // set roles routes.
        this.setRolesRoutes();
    };

    private readonly setRolesRoutes = () => {
        // create role
        this.router
            .route(`${this.path}`)
            .post(
                authMiddleware,
                validationSchemaMiddleware({ body: { schema: CreateRoleSchema } }),
                rolesController.createRole
            )
            .get(
                authMiddleware,
                validationSchemaMiddleware({ body: { schema: PaginationSchema } }),
                rolesController.getRoles
            )

        // get / update role by Id.
        this.router
            .route(`${this.router}/:id`)
            .get(
                authMiddleware,
                rolesController.getRoleById
            )
            .put(
                authMiddleware,
                validationSchemaMiddleware({ body: { schema: UpdateRoleSchema } }),
                rolesController.updateRole
            )
            .patch(
                authMiddleware,
                validationSchemaMiddleware({ body: { schema: CreateRoleSchema } }),
                rolesController.updateRole
            )
            .delete(
                authMiddleware,
                rolesController.deleteRole
            )
    }
}
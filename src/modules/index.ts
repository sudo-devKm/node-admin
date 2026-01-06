import { AppRoute } from "@app/types";
import { AuthRoute } from "./auth/auth.route";
import { PermissionsRoute } from "./permissions/permissions.route";
import { RolesRoute } from "./roles/roles.route";

export default [
    new AuthRoute(),
    new PermissionsRoute(),
    new RolesRoute()
] as AppRoute[]
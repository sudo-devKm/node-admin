import { AppRoute } from "@app/types";
import { AuthRoute } from "./auth/auth.route";

export default [
    new AuthRoute()
] as AppRoute[]
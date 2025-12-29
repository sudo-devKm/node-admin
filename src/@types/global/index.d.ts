import { User } from "@app/entities/user.entity";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}
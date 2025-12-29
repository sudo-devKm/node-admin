import "dotenv/config";
import { cleanEnv, num, str } from "envalid";

export const envs = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    PORT: num(),
    JWT_SECRET: str(),
    DB_HOST: str(),
    DB_USERNAME: str(),
    DB_PASSWORD: str(),
    DB_PORT: num(),
    DB_NAME: str()
});
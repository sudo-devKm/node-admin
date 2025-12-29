import "reflect-metadata";
import { resolve } from "path";
import { DataSource } from "typeorm";
import { envs } from "@config/envs.validate";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: envs.DB_HOST,
    port: envs.DB_PORT,
    username: envs.DB_USERNAME,
    password: envs.DB_PASSWORD,
    database: envs.DB_NAME,
    synchronize: false,
    logging: envs.isDevelopment,
    entities: [resolve(__dirname, "./../entities/**/*.entity.ts")],
    migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
    migrationsTableName: 'migrations',
    migrationsTransactionMode: 'each',
    invalidWhereValuesBehavior: { null: 'sql-null', undefined: 'ignore' }
})
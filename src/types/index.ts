import { Response, Router } from "express";
import { ZodObject, core } from "zod";
import { DeepPartial, FindOneOptions, FindOptionsWhere, ObjectLiteral, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/browser";

export interface AppRoute {
    readonly router: Router
    readonly path?: string;
};

export type HttpExceptionOptions = {
    status?: number;
    message?: string;
    success?: boolean;
    data?: Record<string, any>;
};

export type ErrorResponse = {
    success?: boolean;
    message?: string;
    data?: any;
    details?: string;
};

export type SchemaValidationItem = {
    schema: ZodObject,
    options?: core.ParseContext<core.$ZodIssue>
};

export type SchemaValidationOptions = {
    [key: string]: SchemaValidationItem
};

export type SendResponseOptions = {
    status?: number;
    res: Response;
    data?: Record<string, any> | null | undefined;
    message?: string;
    success?: boolean;
}

export type FindAllOptions<Entity extends ObjectLiteral> = string | string[] | number | number[] | Date | Date[] | FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]

export type CommonOptions<T extends ObjectLiteral> = {
    repository: Repository<T>;
};

export type CreateEntityOptions<T extends ObjectLiteral> = CommonOptions<T> & {
    createInput: DeepPartial<T>;
};

export type FindOneEntityOptions<T extends ObjectLiteral> = CommonOptions<T> & {
    findOptions: FindOneOptions<T>;
};

export type UpdateEntityOptions<T extends ObjectLiteral> = CommonOptions<T> & {
    updateInput: QueryDeepPartialEntity<T>;
    entityId: string;
};

export type UpdateAllEntityOptions<T extends ObjectLiteral> = CommonOptions<T> & {
    findOptions: FindAllOptions<T>;
    updateInput: QueryDeepPartialEntity<T>;
}
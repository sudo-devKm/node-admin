import { EntityTarget, ObjectLiteral } from "typeorm";
import { AppDataSource } from "@app/database/data-source"
import { CreateEntityOptions, FindOneEntityOptions, UpdateAllEntityOptions, UpdateEntityOptions } from "@app/types";

export const getEntityRepository = <T extends ObjectLiteral>(entity: EntityTarget<T>) => {
    return AppDataSource.getRepository(entity);
};

export const createEntity = <T extends ObjectLiteral>(options: CreateEntityOptions<T>) => {
    const { createInput, repository } = options;
    const entity = repository.create(createInput);
    return repository.save(entity);
};

export const getEntity = <T extends ObjectLiteral>(options: FindOneEntityOptions<T>) => {
    const { findOptions, repository } = options;
    return repository.findOne(findOptions);
};

export const updateEntityById = <T extends ObjectLiteral>(options: UpdateEntityOptions<T>) => {
    const { updateInput, entityId, repository } = options;
    return repository.update(entityId, updateInput);
};

export const updateManyUsers = <T extends ObjectLiteral>(options: UpdateAllEntityOptions<T>) => {
    const { findOptions, repository, updateInput } = options;
    return repository.update(findOptions, updateInput);
};
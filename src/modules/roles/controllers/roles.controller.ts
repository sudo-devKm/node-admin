import { NextFunction, Request, Response } from "express";
import { CreateRolePayload } from "../validation/createRole.validation";
import { AppDataSource } from "@app/database/data-source";
import { Role } from "@app/entities/role.entity";
import { sendResponse } from "@app/utils/common.util";
import { StatusCodes } from "http-status-codes";
import { QueryDeepPartialEntity } from "typeorm";
import { HttpException } from "@app/exceptions/http.exception";
import { UpdateRolePayload } from "../validation/updateRole.validation";
import { createEntity, getEntity, getEntityRepository, updateEntityById } from "@app/database/base.repository";

class RolesController {

    constructor() { };

    readonly createRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createRolePayload: CreateRolePayload = req.body;
            // extract permissions.
            const { permissions, ...otherRoleData } = createRolePayload ?? {};
            // create transaction.
            const role = await AppDataSource.transaction(async (manager) => {
                // get role repository.
                const roleRepo = manager.getRepository(Role);
                // create role 
                const createdRole = await createEntity<Role>({
                    repository: roleRepo,
                    createInput: { ...otherRoleData, permissions: (permissions ?? []).map((_perm) => ({ id: _perm })) }
                });
                // fetch role detailed information.
                const role = await getEntity({ repository: roleRepo, findOptions: { where: { id: createdRole.id }, relations: ["permissions"] } });
                // return created role.
                return role!;
            });
            // send response.
            return sendResponse({
                res,
                data: role,
                status: StatusCodes.CREATED,
                message: 'Role created successfully'
            });
        } catch (err) {
            return next(err);
        }
    };

    readonly getRoles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, pagesize } = req.body;
            // get roles repository.
            const roleRepo = getEntityRepository(Role);
            // get roles.
            const [roles, count] = await roleRepo.findAndCount({ skip: (page - 1) * pagesize, take: pagesize });
            // send response
            return sendResponse({
                res,
                data: { roles, count },
                message: 'Roles fetched successfully'
            })
        } catch (err) {
            return next(err);
        }
    };

    readonly updateRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updateRolePayload: UpdateRolePayload = req.body;
            // extract data.
            const { permissions, ...otherRoleData } = updateRolePayload;
            // extract role id.
            const { id } = req.params;
            // create transaction.
            const updatedRole = await AppDataSource.transaction(async (manager) => {
                // get role repository.
                const roleRepo = manager.getRepository(Role);
                // check role exists
                const role = await getEntity({ repository: roleRepo, findOptions: { where: { id: id! } } });
                // if role not exists then throw error.
                if (!role) {
                    throw new HttpException({ message: 'Role is not found', status: StatusCodes.NOT_FOUND });
                };
                // update role.
                await updateEntityById({
                    entityId: id!,
                    repository: roleRepo,
                    updateInput: <QueryDeepPartialEntity<Role>>{
                        ...otherRoleData,
                        permissions: (permissions ?? []).length > 0 ? permissions!.map((_perm) => ({ id: _perm }))! : undefined
                    }
                });
                // fetch updated role.
                const updatedRole = await getEntity({ repository: roleRepo, findOptions: { where: { id: id! } } });
                // return updated role.
                return updatedRole;
            });
            // send response.
            return sendResponse({
                res,
                data: updatedRole,
                message: 'Role updated Successfully'
            });
        } catch (err) {
            return next(err);
        }
    };

    readonly getRoleById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // extract id.
            const { id } = req.params;
            // get role repository.
            const roleRepo = getEntityRepository(Role);
            // get role data.
            const role = await getEntity({
                findOptions: { where: { id: id! }, relations: ["permissions"] },
                repository: roleRepo
            });
            // check role data.
            if (!role) {
                throw new HttpException({ message: 'Role is not found', status: StatusCodes.NOT_FOUND })
            };
            // send response.
            return sendResponse({
                res,
                data: role,
                message: 'Role fetched successfully'
            });
        } catch (err) {
            return next(err);
        }
    };

    readonly deleteRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // extract id.
            const { id } = req.params;
            // get role repository.
            const roleRepo = getEntityRepository(Role);
            // get role data.
            const role = await getEntity({ findOptions: { where: { id: id! } }, repository: roleRepo });
            // check role data.
            if (!role) {
                throw new HttpException({ message: 'Role is not found', status: StatusCodes.NOT_FOUND })
            };
            // delete role.
            await roleRepo.delete({ id: id! });
            // send response.
            return sendResponse({
                res,
                status: StatusCodes.NO_CONTENT
            });
        } catch (err) {
            return next(err);
        }
    }
};

export default new RolesController();
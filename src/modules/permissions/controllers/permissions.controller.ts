import { getEntityRepository } from "@app/database/base.repository";
import { Permission } from "@app/entities/permission.entity";
import { sendResponse } from "@app/utils/common.util";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class PermissionController {

    constructor() {
        /** */
    };

    readonly getPermissions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get permission repository.
            const permissionRepo = getEntityRepository(Permission);
            // get all permissions.
            const [permissions, count] = await permissionRepo.findAndCount({});
            // send response.
            return sendResponse({
                res,
                data: { permissions, count },
                message: 'Permissions fetched successfully',
                status: StatusCodes.OK
            });
        } catch (err) {
            return next(err);
        }
    }
}

export default new PermissionController();
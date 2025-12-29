import { getEntityRepository } from "@app/database/base.repository";
import { User } from "@app/entities/user.entity";
import { sendResponse } from "@app/utils/common.util";
import { NextFunction, Request, Response } from "express";

class UsersController {
    constructor() { };

    readonly getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page = 1, pagesize = 50 } = req.query;
            // create skip
            const skip = (+page - 1) * +pagesize
            // get repository.
            const userRepo = getEntityRepository(User);
            // get users.
            const [users, count] = await userRepo.findAndCount({ skip, take: +pagesize, relations: { role: true } });
            // send response.
            return sendResponse({
                res,
                message: 'Users fetched successfully.',
                data: { users, count },
            });
        } catch (err) {
            return next(err);
        }
    };

    readonly createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (err) {
            return next(err);
        }
    }
};

export default new UsersController();
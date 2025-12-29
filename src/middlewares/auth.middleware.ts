import { getEntity, getEntityRepository } from "@app/database/base.repository";
import { User } from "@app/entities/user.entity";
import { HttpException } from "@app/exceptions/http.exception";
import { verifyAuthToken } from "@app/utils/common.util";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authToken = _.get(req, 'cookies.x-app-auth', '');
        // get user details
        const userDetails = verifyAuthToken(authToken);

        if (!userDetails) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid or missing authentication token",
            })
        }
        // get user repository.
        const userRepo = getEntityRepository<User>(User);
        // get user details.
        const authenticatedUser = await getEntity({ repository: userRepo, findOptions: { where: { id: userDetails?.id } } });
        // check user details exists.
        if (!authenticatedUser) {
            throw new HttpException({ status: StatusCodes.NOT_FOUND, message: "User not found" });
        };
        // set current user.
        req.currentUser = authenticatedUser;
        // next route handler.
        return next();
    } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Invalid or missing authentication token",
        })
    }
}
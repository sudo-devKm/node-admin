import _ from "lodash";
import { add } from "date-fns";
import { User } from "@app/entities/user.entity";
import { StatusCodes } from "http-status-codes";
import { envs } from "@app/config/envs.validate";
import { NextFunction, Request, Response } from "express";
import { QueryDeepPartialEntity } from "typeorm";
import { AppDataSource } from "@app/database/data-source";
import { LoginInput } from "../validation/login.validation";
import { HttpException } from "@app/exceptions/http.exception";
import { RegisterInput } from "../validation/register.validation";
import { ProfileUpdateInput } from "../validation/profile.validation";
import { createAuthToken, sendResponse } from "@app/utils/common.util";
import { createEntity, getEntity, getEntityRepository, updateEntityById } from "@app/database/base.repository";

class AuthController {
    constructor() {
        /** */
    };

    readonly register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const registerPayload: RegisterInput = req.body;

            const user = await AppDataSource.transaction(async (manager) => {
                const userRepo = manager.getRepository(User);

                const emailUser = await getEntity<User>({ repository: userRepo, findOptions: { where: { email: registerPayload.email } } });

                if (emailUser) {
                    throw new HttpException({ message: 'User already exists', status: StatusCodes.BAD_REQUEST });
                }

                const user = await createEntity<User>({ repository: userRepo, createInput: registerPayload });
                return user;
            });

            return sendResponse({
                res,
                data: _.omit(user, ['password']),
                message: "User registered successfully",
                success: true,
            })
        } catch (err) {
            return next(err);
        }
    };

    readonly login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loginInput: LoginInput = req.body;
            // create user repository.
            const userRepo = getEntityRepository(User);
            // fetch user
            const user = await userRepo.findOne({ where: { email: loginInput.email }, select: { email: true, password: true, id: true } });
            // if user not found then throw error.
            if (!user) {
                throw new HttpException({ message: 'User not found', status: StatusCodes.NOT_FOUND });
            };
            // compare password.
            if (!(await user.comparePassword(loginInput.password))) {
                throw new HttpException({ message: 'Invalid credentials', status: StatusCodes.BAD_REQUEST });
            };
            const authToken = createAuthToken({ email: user.email, id: user.id });
            // set cookie.
            res.cookie('x-app-auth', authToken, {
                maxAge: 60 * 60 * 24 * 1000,
                httpOnly: true,
                secure: !envs.isDevelopment,
                expires: add(new Date(), { days: 1 }),
                ...!envs.isDevelopment && { sameSite: 'none' }
            });
            // send response.
            return sendResponse({
                res,
                message: 'Login successful.',
                status: StatusCodes.OK,
                success: true
            })
        } catch (err) {
            return next(err);
        }
    };

    readonly authenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // send response.
            return sendResponse({
                res,
                data: req.currentUser,
                message: 'User fetched successfully',
                status: StatusCodes.OK
            })
        } catch (err) {
            return next(err);
        }
    };

    readonly logout = (req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie('x-app-auth', {
                httpOnly: true,
                secure: !envs.isDevelopment,
                ...(!envs.isDevelopment && { sameSite: 'none' }),
            });

            return sendResponse({
                res,
                status: StatusCodes.OK,
                message: "User logged out successfully"
            });
        } catch (err) {
            return next(err);
        }
    };

    readonly updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { currentUser, body } = req;
            // get profile input.
            const profileUpdateInput: ProfileUpdateInput = body;
            // update profile.
            const updatedUser = await AppDataSource.transaction(async (manager) => {
                // get user repository.
                const userRepo = manager.getRepository(User);
                // update user profile.
                await updateEntityById({ repository: userRepo, entityId: currentUser!.id!, updateInput: <QueryDeepPartialEntity<User>>profileUpdateInput });
                // get user profile information.
                const updateUser = await getEntity({ repository: userRepo, findOptions: { where: { id: currentUser!.id! } } });
                // return updated user.
                return updateUser!;
            });
            // send profile response.
            return sendResponse({
                res,
                message: "User profile updated successfully",
                data: updatedUser
            });
        } catch (err) {
            return next(err);
        }
    };

    readonly updateCurrentUserPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { currentUser, body } = req;
            // update current user password.
            await AppDataSource.transaction(async (manager) => {
                // get user repository.
                const userRepo = manager.getRepository(User);
                // get user details.
                const user = await getEntity<User>({ findOptions: { where: { id: currentUser!.id! } }, repository: userRepo });
                // check user.
                if (!user) {
                    throw new HttpException({ message: 'User not found', status: StatusCodes.NOT_FOUND });
                };
                // set password.
                user.password = body.password;
                // update user password.
                await userRepo.save(user);
            });
            // send response.
            return sendResponse({ res, message: "User password updated successfully" });
        } catch (err) {
            return next(err);
        }
    }
};

export default new AuthController();
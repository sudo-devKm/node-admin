import Jwt, { JwtPayload } from "jsonwebtoken";
import { SendResponseOptions } from "@app/types";
import { StatusCodes } from "http-status-codes";
import { envs } from "@app/config/envs.validate";

export const sendResponse = (options: SendResponseOptions) => {
    const { res, data = null, message = 'Success !', status = StatusCodes.OK, success = true } = options;
    return res.status(status).json({ message, success, data });
};

export const createAuthToken = (user: { email: string; id: string }) => {
    return Jwt.sign(user, envs.JWT_SECRET, { issuer: 'admin-app', expiresIn: '1D' });
};

export const verifyAuthToken = (token: string) => {
    return <JwtPayload>Jwt.verify(token, envs.JWT_SECRET);
};
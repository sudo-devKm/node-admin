

import { ErrorResponse } from "@app/types";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "@app/exceptions/http.exception";
import { NextFunction, Request, Response } from "express";

// Helper to create a unified error response object
function createErrorResponse(error: any): ErrorResponse {
    // Hide stack trace in production
    return {
        success: error?.success ?? false,
        message: error?.message ?? 'Something went wrong',
        data: error?.data ?? null
    };
};

export const errorHandlerMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof HttpException) {
        return res.status(error.status).json(createErrorResponse(error));
    };

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorResponse(error))
};
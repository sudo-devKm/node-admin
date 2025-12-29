import _ from "lodash";
import { SchemaValidationOptions } from "@app/types";
import { NextFunction, Request, Response } from "express"
import { core, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

export const validationSchemaMiddleware = (options: SchemaValidationOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationResponse = await Promise.allSettled(
                _.map(options ?? {}, async ({ schema, options }, key: string) => {
                    return schema.parseAsync(_.get(req, key, {}), options).catch((error) => {
                        throw { zodValidationError: (<ZodError>error)?.issues, key }
                    })
                })
            );

            const errors = _.chain(validationResponse)
                .filter((resp) => resp.status === 'rejected')
                .flatMap((errorResp) => _.map(_.get(errorResp, 'reason.zodValidationError', []), (zodError: core.$ZodIssue) => {
                    return { message: zodError?.message, path: zodError?.path?.at(0) }
                }))
                .value();

            if (errors.length) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                    message: 'Kindly provide valid payload',
                    success: false,
                    details: errors
                })
            }

            return next();
        } catch (err) {
            return next(err);
        }
    }
};
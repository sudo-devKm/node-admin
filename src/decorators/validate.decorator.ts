
import _ from "lodash";
import { core, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

/**
 * Decorator to validate and transform request data using Zod schemas, supporting multiple keys and options.
 * Usage:
 *   @Validate({ body: { schema, options }, query: { schema, options } })
 *   async handler(req, res, next) { ... }
 */
export const Validate = (options: Record<string, { schema: any, options?: any }>) => {
    return (
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const validationResponse = await Promise.allSettled(
                    _.map(options ?? {}, async ({ schema, options: zodOptions }, key: string) => {
                        // Validate and transform the property (body, query, params, etc.)
                        return schema.parseAsync(_.get(req, key, {}), zodOptions)
                            .then((parsed: any) => {
                                _.set(req, key, parsed);
                                return parsed;
                            })
                            .catch((error: any) => {
                                throw { zodValidationError: (error as ZodError)?.issues, key };
                            });
                    })
                );

                const errors = _.chain(validationResponse)
                    .filter((resp) => resp.status === 'rejected')
                    .flatMap((errorResp) => _.map(_.get(errorResp, 'reason.zodValidationError', []), (zodError: core.$ZodIssue) => {
                        return { message: zodError?.message, path: zodError?.path?.at(0) };
                    }))
                    .value();

                if (errors.length) {
                    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                        message: 'Kindly provide valid payload',
                        success: false,
                        details: errors
                    });
                }

                return originalMethod.apply(this, [req, res, next]);
            } catch (err) {
                return next(err);
            }
        };
        return descriptor;
    };
}

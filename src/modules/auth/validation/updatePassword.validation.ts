import z from "zod";
import { RegisterSchema } from "./register.validation";

export const UpdatePasswordSchema = RegisterSchema.pick({ password: true })
    .extend({
        confirm_password: z.string()
    }).superRefine((data, ctx) => {
        if (data.password !== data.confirm_password) {
            ctx.addIssue({
                code: 'custom',
                message: 'Passwords do not match',
                path: ["confirm_password"]
            });
        }
    }).strict();

export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
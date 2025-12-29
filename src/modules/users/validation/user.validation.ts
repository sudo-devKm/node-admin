import { RegisterSchema } from "@app/modules/auth/validation/register.validation";
import z from "zod";

export const GetUsersSchema = z.object({
    page: z.number().default(1).optional(),
    pagesize: z.number().default(50).optional()
}).strict();

export type GetUsersInput = z.infer<typeof GetUsersSchema>;

export const CreateUserSchema = RegisterSchema.pick({
    email: true,
    first_name: true,
    last_name: true
})
    .strict();

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
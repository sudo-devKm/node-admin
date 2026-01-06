import z from "zod";
import { CreateRoleSchema } from "./createRole.validation";

export const UpdateRoleSchema = CreateRoleSchema
    .partial()
    .refine((data) => Object.keys(data)?.length > 0, "At least one field must be provided");;

export type UpdateRolePayload = z.infer<typeof UpdateRoleSchema>
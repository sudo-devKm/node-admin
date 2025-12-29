import z from "zod";
import { RegisterSchema } from "./register.validation";

export const ProfileUpdateSchema = RegisterSchema
    .pick({ email: true, first_name: true, last_name: true })
    .partial()
    .strict()
    .refine((data) => Object.keys(data)?.length > 0, "At least one field must be provided");

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
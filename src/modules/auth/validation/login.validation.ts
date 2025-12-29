import z from "zod";
import { RegisterSchema } from "./register.validation";

export const LoginSchema = RegisterSchema.pick({ email: true, password: true }).strict();

export type LoginInput = z.infer<typeof LoginSchema>
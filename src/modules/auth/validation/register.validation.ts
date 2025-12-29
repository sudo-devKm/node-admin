import z from "zod";

export const RegisterSchema = z.object({
    first_name: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(50)
        .meta({ title: 'First Name' }),
    last_name: z
        .string()
        .trim()
        .meta({ title: 'Last Name' }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100)
        .regex(/[A-Z]/, "One uppercase letter required")
        .regex(/[0-9]/, "One number required")
        .meta({ title: 'Password' }),
    email: z
        .email("Invalid email address")
        .toLowerCase()
        .meta({ title: 'Email' })
}).strict();

export type RegisterInput = z.infer<typeof RegisterSchema>;
import z from "zod";

export const CreateRoleSchema = z.object({
    name: z.string().meta({ description: 'Role Name' }),
    permissions: z.array(z.string()).meta({ description: 'Permissions' })
}).strict();

export type CreateRolePayload = z.infer<typeof CreateRoleSchema>
import z from "zod";

export const PaginationSchema = z.object({
    page: z.number().default(1).meta({ description: "Page" }),
    pagesize: z.number().default(50).meta({ description: 'Page Size' })
}).strict();

export type PaginationPayload = z.infer<typeof PaginationSchema>
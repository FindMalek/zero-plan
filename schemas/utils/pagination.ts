import { z } from "zod"

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
})

export type PaginationSchema = z.infer<typeof paginationSchema>

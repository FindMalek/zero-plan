import { z } from "zod"

export const TagDto = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().optional(),
  userId: z.string().optional(),
  containerId: z.string().optional(),
})

export const TagSimpleRoSchema = z.object({
  id: z.string(),
  name: z.string(),

  color: z.string().nullable(),

  userId: z.string().nullable(),
  containerId: z.string().nullable(),
})

export type TagDto = z.infer<typeof TagDto>
export type TagSimpleRo = z.infer<typeof TagSimpleRoSchema>

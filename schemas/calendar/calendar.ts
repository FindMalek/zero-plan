import { z } from "zod"

// Calendar Schema
export const calendarSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color").default("#3B82F6"),
  emoji: z.string().min(1, "Emoji is required").default("📅"),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().uuid(),
})

export type CalendarInfer = z.infer<typeof calendarSchema>

import { z } from "zod"

// Return Object (RO) schema
export const WaitlistUserRo = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
})

export type WaitlistUserRo = z.infer<typeof WaitlistUserRo>

// Data Transfer Object (DTO) schema
export const WaitlistUserDtoSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export type WaitlistUserDto = z.infer<typeof WaitlistUserDtoSchema>

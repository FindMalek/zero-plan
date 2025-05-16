import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean(),
})

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  image: z.string().url("Please enter a valid image URL").optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>

export const WaitlistUserRo = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
})

export type WaitlistUserRo = z.infer<typeof WaitlistUserRo>

export const WaitlistUserDtoSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export type WaitlistUserDto = z.infer<typeof WaitlistUserDtoSchema>

export const UserDto = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  emailVerified: z.boolean().default(false),
  image: z.string().url().optional(),
})

export const UserRo = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type UserDto = z.infer<typeof UserDto>
export type UserRo = z.infer<typeof UserRo>

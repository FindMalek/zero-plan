import { z } from "zod"

// =============================================================================
// USER DTOs (Data Transfer Objects - API Inputs)
// =============================================================================

// Create User DTO
export const createUserDto = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  email: z.string().email("Please enter a valid email address"),
  image: z.string().url("Image must be a valid URL").optional(),
})

export type CreateUserDto = z.infer<typeof createUserDto>

// Update User DTO
export const updateUserDto = z.object({
  id: z.string().uuid("Invalid user ID"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  image: z.string().url("Image must be a valid URL").optional(),
})

export type UpdateUserDto = z.infer<typeof updateUserDto>

// Get User DTO
export const getUserDto = z.object({
  id: z.string().uuid("Invalid user ID"),
})

export type GetUserDto = z.infer<typeof getUserDto>

// Delete User DTO
export const deleteUserDto = z.object({
  id: z.string().uuid("Invalid user ID"),
})

export type DeleteUserDto = z.infer<typeof deleteUserDto>

// List Users DTO
export const listUsersDto = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  emailVerified: z.boolean().optional(),
})

export type ListUsersDto = z.infer<typeof listUsersDto>

// Get User Profile DTO
export const getUserProfileDto = z.object({
  id: z.string().uuid("Invalid user ID"),
})

export type GetUserProfileDto = z.infer<typeof getUserProfileDto>

// Update User Profile DTO
export const updateUserProfileDto = z.object({
  id: z.string().uuid("Invalid user ID"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  image: z.string().url("Image must be a valid URL").optional(),
})

export type UpdateUserProfileDto = z.infer<typeof updateUserProfileDto>

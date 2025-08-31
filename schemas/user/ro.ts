import { z } from "zod"

// =============================================================================
// USER RESPONSE OBJECTS (Three-Tier System)
// =============================================================================

// User Simple RO (Basic user - no relations)
export const userSimpleRo = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type UserSimpleRo = z.infer<typeof userSimpleRo>

// User RO (With basic stats)
export const userRo = userSimpleRo.extend({
  totalCalendars: z.number().optional(),
  totalEvents: z.number().optional(),
  totalProcessingSessions: z.number().optional(),
})

export type UserRo = z.infer<typeof userRo>

// User Full RO (With calendars and basic event info)
export const userFullRo = userSimpleRo.extend({
  totalCalendars: z.number().optional(),
  totalEvents: z.number().optional(),
  totalProcessingSessions: z.number().optional(),
  calendars: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        color: z.string(),
        emoji: z.string(),
        isDefault: z.boolean(),
        isActive: z.boolean(),
        eventCount: z.number().optional(),
      })
    )
    .optional(),
})

export type UserFullRo = z.infer<typeof userFullRo>

// =============================================================================
// API RESPONSE WRAPPERS
// =============================================================================

// Create User Response
export const createUserRo = z.object({
  success: z.boolean(),
  user: userRo.optional(),
  error: z.string().optional(),
})

export type CreateUserRo = z.infer<typeof createUserRo>

// Get User Response
export const getUserRo = z.object({
  success: z.boolean(),
  user: userFullRo.optional(),
  error: z.string().optional(),
})

export type GetUserRo = z.infer<typeof getUserRo>

// Update User Response
export const updateUserRo = z.object({
  success: z.boolean(),
  user: userRo.optional(),
  error: z.string().optional(),
})

export type UpdateUserRo = z.infer<typeof updateUserRo>

// Delete User Response
export const deleteUserRo = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

export type DeleteUserRo = z.infer<typeof deleteUserRo>

// List Users Response
export const listUsersRo = z.object({
  success: z.boolean(),
  users: z.array(userRo).optional(),
  pagination: z
    .object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    })
    .optional(),
  error: z.string().optional(),
})

export type ListUsersRo = z.infer<typeof listUsersRo>

// =============================================================================
// PROFILE-SPECIFIC RESPONSES
// =============================================================================

// User Profile Response (Public view)
export const userProfileRo = z.object({
  id: z.string(),
  name: z.string().optional(),
  image: z.string().optional(),
  createdAt: z.date(),
})

export type UserProfileRo = z.infer<typeof userProfileRo>

// Get User Profile Response
export const getUserProfileRo = z.object({
  success: z.boolean(),
  profile: userProfileRo.optional(),
  error: z.string().optional(),
})

export type GetUserProfileRo = z.infer<typeof getUserProfileRo>

// Update User Profile Response
export const updateUserProfileRo = z.object({
  success: z.boolean(),
  profile: userProfileRo.optional(),
  error: z.string().optional(),
})

export type UpdateUserProfileRo = z.infer<typeof updateUserProfileRo>

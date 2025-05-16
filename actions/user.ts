"use server"

import { headers } from "next/headers"
import { database } from "@/prisma/client"
import { Prisma } from "@prisma/client"
import { z } from "zod"

import { UserDto, UserRo, type UserDto as UserDtoType } from "@/config/schema"
import { auth } from "@/lib/auth/server"

/**
 * Create a new user
 */
export async function createUser(data: UserDtoType): Promise<{
  success: boolean
  user?: UserRo
  error?: string
  issues?: z.ZodIssue[]
}> {
  try {
    // Validate using our DTO schema
    const validatedData = UserDto.parse(data)

    try {
      // Create user with Prisma
      const user = await database.user.create({
        data: {
          id: crypto.randomUUID(),
          ...validatedData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      return {
        success: true,
        user: UserRo.parse(user),
      }
    } catch (error) {
      // Check if this is a unique constraint violation
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return {
          success: false,
          error: "A user with this email already exists",
        }
      }
      throw error
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        issues: error.issues,
      }
    }

    console.error("User creation error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<{
  success: boolean
  user?: UserRo
  error?: string
}> {
  try {
    const user = await database.user.findUnique({
      where: { id },
    })

    if (!user) {
      return {
        success: false,
        error: "User not found",
      }
    }

    return {
      success: true,
      user: UserRo.parse(user),
    }
  } catch (error) {
    console.error("Get user error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<{
  success: boolean
  user?: UserRo
  error?: string
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Not authenticated",
      }
    }

    const user = await database.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return {
        success: false,
        error: "User not found",
      }
    }

    return {
      success: true,
      user: UserRo.parse(user),
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * Update a user
 */
export async function updateUser(
  id: string,
  data: Partial<UserDtoType>
): Promise<{
  success: boolean
  user?: UserRo
  error?: string
  issues?: z.ZodIssue[]
}> {
  try {
    // Make sure user exists
    const existingUser = await database.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return {
        success: false,
        error: "User not found",
      }
    }

    // Validate using our DTO schema (partial)
    const partialUserSchema = UserDto.partial()
    const validatedData = partialUserSchema.parse(data)

    try {
      // Update user with Prisma
      const updatedUser = await database.user.update({
        where: { id },
        data: {
          ...validatedData,
          updatedAt: new Date(),
        },
      })

      return {
        success: true,
        user: UserRo.parse(updatedUser),
      }
    } catch (error) {
      // Check if this is a unique constraint violation
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return {
          success: false,
          error: "A user with this email already exists",
        }
      }
      throw error
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        issues: error.issues,
      }
    }

    console.error("User update error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Make sure user exists
    const existingUser = await database.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return {
        success: false,
        error: "User not found",
      }
    }

    // Delete user with Prisma
    await database.user.delete({
      where: { id },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("User deletion error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * List users with pagination
 */
export async function listUsers(
  page = 1,
  limit = 10
): Promise<{
  success: boolean
  users?: UserRo[]
  total?: number
  error?: string
}> {
  try {
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      database.user.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      database.user.count(),
    ])

    return {
      success: true,
      users: users.map((user) => UserRo.parse(user)),
      total,
    }
  } catch (error) {
    console.error("List users error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

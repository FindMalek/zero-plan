"use server"

import { database } from "@/prisma/client"
import { Prisma } from "@prisma/client"
import { z } from "zod"

import {
  WaitlistUserDtoSchema,
  type WaitlistUserDto,
} from "@/config/schemas/waitlist"

/**
 * Join waitlist server action
 */
export async function joinWaitlist(formData: WaitlistUserDto): Promise<{
  success: boolean
  email?: string
  error?: string
  issues?: z.ZodIssue[]
}> {
  try {
    // Validate using our DTO schema
    const validatedData = WaitlistUserDtoSchema.parse({ email: formData.email })

    try {
      // Create waitlist entry with Prisma
      await database.waitlist.create({
        data: {
          email: validatedData.email,
        },
      })

      return {
        success: true,
        email: validatedData.email,
      }
    } catch (error) {
      // Check if this is a unique constraint violation (email already exists)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return {
          success: false,
          error: "This email is already on our waitlist",
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

    console.error("Waitlist submission error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

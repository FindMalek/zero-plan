"use server"

import { headers } from "next/headers"
import { database } from "@/prisma/client"
import { Prisma } from "@prisma/client"
import { z } from "zod"

import { CardDto, CardRo, type CardDto as CardDtoType } from "@/config/schema"
import { auth } from "@/lib/auth/server"

/**
 * Create a new card
 */
export async function createCard(data: CardDtoType): Promise<{
  success: boolean
  card?: CardRo
  error?: string
  issues?: z.ZodIssue[]
}> {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Not authenticated",
      }
    }

    // Validate using our DTO schema
    const validatedData = CardDto.parse(data)

    // Format expiry date
    const expiryDate = new Date(validatedData.expiryDate)

    try {
      // Create card with Prisma
      const card = await database.card.create({
        data: {
          id: crypto.randomUUID(),
          ...validatedData,
          expiryDate,
          userId: session.user.id,
          createdAt: new Date(),
        },
      })

      return {
        success: true,
        card: CardRo.parse(card),
      }
    } catch (error) {
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

    console.error("Card creation error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * Get card by ID
 */
export async function getCardById(id: string): Promise<{
  success: boolean
  card?: CardRo
  error?: string
}> {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Not authenticated",
      }
    }

    const card = await database.card.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!card) {
      return {
        success: false,
        error: "Card not found",
      }
    }

    return {
      success: true,
      card: CardRo.parse(card),
    }
  } catch (error) {
    console.error("Get card error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * Update a card
 */
export async function updateCard(
  id: string,
  data: Partial<CardDtoType>
): Promise<{
  success: boolean
  card?: CardRo
  error?: string
  issues?: z.ZodIssue[]
}> {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Not authenticated",
      }
    }

    // Make sure card exists and belongs to user
    const existingCard = await database.card.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingCard) {
      return {
        success: false,
        error: "Card not found",
      }
    }

    // Validate using our DTO schema (partial)
    const partialCardSchema = CardDto.partial()
    const validatedData = partialCardSchema.parse(data)

    // Format expiry date if provided
    const updateData: any = { ...validatedData }
    if (validatedData.expiryDate) {
      updateData.expiryDate = new Date(validatedData.expiryDate)
    }

    try {
      // Update card with Prisma
      const updatedCard = await database.card.update({
        where: { id },
        data: updateData,
      })

      return {
        success: true,
        card: CardRo.parse(updatedCard),
      }
    } catch (error) {
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

    console.error("Card update error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * Delete a card
 */
export async function deleteCard(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Not authenticated",
      }
    }

    // Make sure card exists and belongs to user
    const existingCard = await database.card.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingCard) {
      return {
        success: false,
        error: "Card not found",
      }
    }

    // Delete card with Prisma
    await database.card.delete({
      where: { id },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Card deletion error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * List cards with optional filtering and pagination
 */
export async function listCards(
  page = 1,
  limit = 10,
  containerId?: string
): Promise<{
  success: boolean
  cards?: CardRo[]
  total?: number
  error?: string
}> {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Not authenticated",
      }
    }

    const skip = (page - 1) * limit

    // Build filters
    const where: Prisma.CardWhereInput = {
      userId: session.user.id,
    }

    if (containerId) {
      where.containerId = containerId
    }

    const [cards, total] = await Promise.all([
      database.card.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      database.card.count({ where }),
    ])

    return {
      success: true,
      cards: cards.map((card) => CardRo.parse(card)),
      total,
    }
  } catch (error) {
    console.error("List cards error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

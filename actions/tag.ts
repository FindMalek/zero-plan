"use server"

import { database } from "@/prisma/client"
import { Prisma } from "@prisma/client"
import { z } from "zod"

import { TagDto, TagRo, type TagDto as TagDtoType } from "@/config/schema"
import { auth } from "@/lib/auth/server"
import { headers } from "next/headers"

/**
 * Create a new tag
 */
export async function createTag(data: TagDtoType): Promise<{
  success: boolean
  tag?: TagRo
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
    const validatedData = TagDto.parse(data)

    try {
      // Create tag with Prisma
      const tag = await database.tag.create({
        data: {
          id: crypto.randomUUID(),
          ...validatedData,
          userId: session.user.id,
        },
      })

      return {
        success: true,
        tag: TagRo.parse(tag),
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

    console.error("Tag creation error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * Get tag by ID
 */
export async function getTagById(id: string): Promise<{
  success: boolean
  tag?: TagRo
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

    const tag = await database.tag.findFirst({
      where: { 
        id,
        userId: session.user.id,
      },
    })

    if (!tag) {
      return {
        success: false,
        error: "Tag not found",
      }
    }

    return {
      success: true,
      tag: TagRo.parse(tag),
    }
  } catch (error) {
    console.error("Get tag error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * Update a tag
 */
export async function updateTag(id: string, data: Partial<TagDtoType>): Promise<{
  success: boolean
  tag?: TagRo
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

    // Make sure tag exists and belongs to user
    const existingTag = await database.tag.findFirst({
      where: { 
        id,
        userId: session.user.id,
      },
    })

    if (!existingTag) {
      return {
        success: false,
        error: "Tag not found",
      }
    }

    // Validate using our DTO schema (partial)
    const partialTagSchema = TagDto.partial()
    const validatedData = partialTagSchema.parse(data)

    try {
      // Update tag with Prisma
      const updatedTag = await database.tag.update({
        where: { id },
        data: validatedData,
      })

      return {
        success: true,
        tag: TagRo.parse(updatedTag),
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

    console.error("Tag update error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * Delete a tag
 */
export async function deleteTag(id: string): Promise<{
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

    // Make sure tag exists and belongs to user
    const existingTag = await database.tag.findFirst({
      where: { 
        id,
        userId: session.user.id,
      },
    })

    if (!existingTag) {
      return {
        success: false,
        error: "Tag not found",
      }
    }

    // Check if tag is in use by credentials
    const credentialCount = await database.credential.count({
      where: {
        tags: {
          some: {
            id,
          },
        },
      },
    })

    if (credentialCount > 0) {
      return {
        success: false,
        error: "Cannot delete tag that is in use by credentials",
      }
    }

    // Delete tag with Prisma
    await database.tag.delete({
      where: { id },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Tag deletion error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * List tags with optional filtering
 */
export async function listTags(containerId?: string): Promise<{
  success: boolean
  tags?: TagRo[]
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

    // Build filters
    const where: Prisma.TagWhereInput = { 
      userId: session.user.id,
    }

    if (containerId) {
      where.containerId = containerId
    }

    const tags = await database.tag.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    })

    return {
      success: true,
      tags: tags.map((tag) => TagRo.parse(tag)),
    }
  } catch (error) {
    console.error("List tags error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * Add tag to credential
 */
export async function addTagToCredential(tagId: string, credentialId: string): Promise<{
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

    // Make sure tag exists and belongs to user
    const tag = await database.tag.findFirst({
      where: { 
        id: tagId,
        userId: session.user.id,
      },
    })

    if (!tag) {
      return {
        success: false,
        error: "Tag not found",
      }
    }

    // Make sure credential exists and belongs to user
    const credential = await database.credential.findFirst({
      where: { 
        id: credentialId,
        userId: session.user.id,
      },
    })

    if (!credential) {
      return {
        success: false,
        error: "Credential not found",
      }
    }

    // Add tag to credential
    await database.credential.update({
      where: { id: credentialId },
      data: {
        tags: {
          connect: {
            id: tagId,
          },
        },
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Add tag to credential error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

/**
 * Remove tag from credential
 */
export async function removeTagFromCredential(tagId: string, credentialId: string): Promise<{
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

    // Make sure tag exists and belongs to user
    const tag = await database.tag.findFirst({
      where: { 
        id: tagId,
        userId: session.user.id,
      },
    })

    if (!tag) {
      return {
        success: false,
        error: "Tag not found",
      }
    }

    // Make sure credential exists and belongs to user
    const credential = await database.credential.findFirst({
      where: { 
        id: credentialId,
        userId: session.user.id,
      },
    })

    if (!credential) {
      return {
        success: false,
        error: "Credential not found",
      }
    }

    // Remove tag from credential
    await database.credential.update({
      where: { id: credentialId },
      data: {
        tags: {
          disconnect: {
            id: tagId,
          },
        },
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Remove tag from credential error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
} 
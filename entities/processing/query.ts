import { Prisma } from "@/prisma/client"

/**
 * Processing Query Selectors - Prisma select objects for InputProcessingSession
 */
export class ProcessingQuery {
  /**
   * Simple select - basic processing session fields
   */
  static getSimpleSelect() {
    return {
      id: true,
      userInput: true,
      processedOutput: true,
      model: true,
      provider: true,
      processingTimeMs: true,
      tokensUsed: true,
      confidence: true,
      status: true,
      errorMessage: true,
      createdAt: true,
      updatedAt: true,
      eventId: true,
      userId: true,
    } satisfies Prisma.InputProcessingSessionSelect
  }

  /**
   * Standard select - same as simple for processing session
   */
  static getStandardSelect() {
    return this.getSimpleSelect()
  }

  /**
   * Full select - same as simple for processing session
   */
  static getFullSelect() {
    return this.getSimpleSelect()
  }
}

// Type definitions for the select results
export type ProcessingEntitySimpleSelect =
  Prisma.InputProcessingSessionGetPayload<{
    select: ReturnType<typeof ProcessingQuery.getSimpleSelect>
  }>

export type ProcessingEntityStandardSelect =
  Prisma.InputProcessingSessionGetPayload<{
    select: ReturnType<typeof ProcessingQuery.getStandardSelect>
  }>

export type ProcessingEntityFullSelect =
  Prisma.InputProcessingSessionGetPayload<{
    select: ReturnType<typeof ProcessingQuery.getFullSelect>
  }>

import { Prisma } from "@/prisma/client"

export type ProcessingEntitySimpleSelect =
  Prisma.InputProcessingSessionGetPayload<{
    select: ReturnType<typeof ProcessingQuery.getSimpleSelect>
  }>

export type ProcessingEntitySelect = Prisma.InputProcessingSessionGetPayload<{
  select: ReturnType<typeof ProcessingQuery.getSelect>
}>

export type ProcessingEntityFullSelect =
  Prisma.InputProcessingSessionGetPayload<{
    select: ReturnType<typeof ProcessingQuery.getFullSelect>
  }>

export class ProcessingQuery {
  static getSimpleSelect() {
    return {
      id: true,
      userInput: true,
      processedOutput: true,
      model: true,
      provider: true,
      status: true,
      processingTimeMs: true,
      tokensUsed: true,
      confidence: true,
      errorMessage: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    } satisfies Prisma.InputProcessingSessionSelect
  }

  static getSelect() {
    return this.getSimpleSelect()
  }

  static getFullSelect() {
    return this.getSimpleSelect()
  }
}

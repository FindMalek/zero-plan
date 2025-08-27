import {
  aiProcessingStatusEnum,
  AIProcessingStatusInfer,
  EventAISimpleRo,
} from "@/schemas/event"
// Using string literal for now - will be available after database creation
type AIProcessingStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "RETRY"

import { EventAIEntitySimpleDbData } from "./query"

export class EventAIEntity {
  static getSimpleRo(entity: EventAIEntitySimpleDbData): EventAISimpleRo {
    return {
      id: entity.id,
      rawInput: entity.rawInput,
      processedOutput: entity.processedOutput as Record<string, any>,
      model: entity.model,
      provider: entity.provider,
      processingTime: entity.processingTime || undefined,
      confidence: entity.confidence || undefined,
      status: this.convertPrismaToAIProcessingStatus(entity.status as AIProcessingStatus),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      eventId: entity.eventId,
    }
  }

  static convertPrismaToAIProcessingStatus(status: AIProcessingStatus): AIProcessingStatusInfer {
    switch (status) {
      case "PENDING":
        return aiProcessingStatusEnum.PENDING
      case "PROCESSING":
        return aiProcessingStatusEnum.PROCESSING
      case "COMPLETED":
        return aiProcessingStatusEnum.COMPLETED
      case "FAILED":
        return aiProcessingStatusEnum.FAILED
      case "RETRY":
        return aiProcessingStatusEnum.RETRY
      default:
        return aiProcessingStatusEnum.PENDING
    }
  }

  static convertAIProcessingStatusToPrisma(status: AIProcessingStatusInfer): AIProcessingStatus {
    switch (status) {
      case aiProcessingStatusEnum.PENDING:
        return "PENDING"
      case aiProcessingStatusEnum.PROCESSING:
        return "PROCESSING"
      case aiProcessingStatusEnum.COMPLETED:
        return "COMPLETED"
      case aiProcessingStatusEnum.FAILED:
        return "FAILED"
      case aiProcessingStatusEnum.RETRY:
        return "RETRY"
      default:
        return "PENDING"
    }
  }

  static convertAIProcessingStatusToString(status: AIProcessingStatusInfer): string {
    switch (status) {
      case aiProcessingStatusEnum.PENDING:
        return "Pending"
      case aiProcessingStatusEnum.PROCESSING:
        return "Processing"
      case aiProcessingStatusEnum.COMPLETED:
        return "Completed"
      case aiProcessingStatusEnum.FAILED:
        return "Failed"
      case aiProcessingStatusEnum.RETRY:
        return "Retry"
      default:
        return "Unknown"
    }
  }
}

import {
  ProcessingSessionFullRo,
  ProcessingSessionRo,
  ProcessingSessionSimpleRo,
} from "@/schemas/processing"

/**
 * Processing Entity - Pure data transformation for InputProcessingSession operations
 */
export class ProcessingEntity {
  /**
   * Convert database result to ProcessingSessionSimpleRo
   */
  static toSimpleRo(data: any): ProcessingSessionSimpleRo {
    return {
      id: data.id,
      userInput: data.userInput,
      model: data.model,
      provider: data.provider,
      status: data.status,
      processingTimeMs: data.processingTimeMs || undefined,
      tokensUsed: data.tokensUsed || undefined,
      confidence: data.confidence || undefined,
      errorMessage: data.errorMessage || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      userId: data.userId,
    }
  }

  /**
   * Convert database result to ProcessingSessionRo
   */
  static toRo(data: any): ProcessingSessionRo {
    return this.toSimpleRo(data)
  }

  /**
   * Convert database result to ProcessingSessionFullRo
   */
  static toFullRo(data: any): ProcessingSessionFullRo {
    return this.toSimpleRo(data)
  }
}

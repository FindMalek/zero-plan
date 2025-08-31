import {
  ProcessingSessionFullRo,
  ProcessingSessionRo,
  ProcessingSessionSimpleRo,
} from "@/schemas/processing"

export class ProcessingEntity {
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

  static toRo(data: any): ProcessingSessionRo {
    return this.toSimpleRo(data)
  }

  static toFullRo(data: any): ProcessingSessionFullRo {
    return this.toSimpleRo(data)
  }
}

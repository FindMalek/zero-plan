import {
  ProcessingEntityFullSelect,
  ProcessingEntitySelect,
  ProcessingEntitySimpleSelect,
} from "@/entities/processing"
import {
  ProcessingSessionFullRo,
  ProcessingSessionRo,
  ProcessingSessionSimpleRo,
} from "@/schemas/processing"

export class ProcessingEntity {
  static toSimpleRo(
    data: ProcessingEntitySimpleSelect
  ): ProcessingSessionSimpleRo {
    return {
      id: data.id,
      userInput: data.userInput,
      model: data.model,
      provider: data.provider,
      status: data.status,
      processingTimeMs: data.processingTimeMs || undefined,
      tokensUsed: data.tokensUsed || undefined,
      confidence: data.confidence || undefined,
      metadata: data.processedOutput as
        | Record<string, string | number | boolean>
        | undefined,
      errorMessage: data.errorMessage || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      userId: data.userId,
    }
  }

  static toRo(data: ProcessingEntitySelect): ProcessingSessionRo {
    return this.toSimpleRo(data)
  }

  static toFullRo(data: ProcessingEntityFullSelect): ProcessingSessionFullRo {
    return this.toSimpleRo(data)
  }
}

// Using manual types until database is created
export type EventAIEntitySimpleDbData = {
  id: string
  rawInput: string
  processedOutput: any
  model: string
  provider: string
  processingTime: number | null
  confidence: number | null
  status: string
  createdAt: Date
  updatedAt: Date
  eventId: string
}

export class EventAIQuery {
  static getSimpleSelect(): any {
    return {
      id: true,
      rawInput: true,
      processedOutput: true,
      model: true,
      provider: true,
      processingTime: true,
      confidence: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      eventId: true,
    }
  }
}

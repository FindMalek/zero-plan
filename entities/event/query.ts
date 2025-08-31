// Using any for now until database is created
type Prisma = any

export type EventEntitySimpleDbData = {
  id: string
  title: string
  description: string | null
  startTime: Date
  endTime: Date | null
  location: string | null
  status: string
  priority: string
  category: string
  originalInput: string | null
  aiProcessed: boolean
  aiConfidence: number | null
  createdAt: Date
  updatedAt: Date
  userId: string
}

export type EventEntityWithAIDbData = EventEntitySimpleDbData & {
  aiProcessing: {
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
  }[]
}

export class EventQuery {
  static getSimpleSelect(): any {
    return {
      id: true,
      title: true,
      description: true,
      startTime: true,
      endTime: true,
      location: true,
      status: true,
      priority: true,
      category: true,
      originalInput: true,
      aiProcessed: true,
      aiConfidence: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    }
  }

  static getWithAISelect(): any {
    return {
      ...this.getSimpleSelect(),
      aiProcessing: {
        select: {
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
        },
      },
    }
  }
}

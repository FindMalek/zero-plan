import { RecurrenceEntitySimpleSelect } from "@/entities/events/recurrence"
import { EventRecurrenceRo } from "@/schemas/event"

export class RecurrenceEntity {
  static toSimpleRo(data: RecurrenceEntitySimpleSelect): EventRecurrenceRo {
    return {
      id: data.id,
      pattern: data.pattern,
      endDate: data.endDate || undefined,
      customRule: data.customRule as
        | Record<string, string | number | boolean>
        | undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      eventId: data.eventId,
    }
  }
}

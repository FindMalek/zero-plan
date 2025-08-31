import { ReminderEntitySimpleSelect } from "@/entities/events/reminder"
import { EventReminderRo } from "@/schemas/event"

export class ReminderEntity {
  static toSimpleRo(data: ReminderEntitySimpleSelect): EventReminderRo {
    return {
      id: data.id,
      value: data.value,
      unit: data.unit,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      eventId: data.eventId,
    }
  }
}

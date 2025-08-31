import {
  ReminderEntityFullSelect,
  ReminderEntitySelect,
  ReminderEntitySimpleSelect,
} from "@/entities/events/reminder"
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

  static toRo(data: ReminderEntitySelect): EventReminderRo {
    return this.toSimpleRo(data)
  }

  static toFullRo(data: ReminderEntityFullSelect): EventReminderRo {
    return this.toSimpleRo(data)
  }
}

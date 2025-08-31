import { CalendarEntitySimpleSelect } from "@/entities/calendar"
import {
  CalendarFullRo,
  CalendarRo,
  CalendarSimpleRo,
} from "@/schemas/calendar"

export class CalendarEntity {
  static toSimpleRo(data: CalendarEntitySimpleSelect): CalendarSimpleRo {
    return {
      id: data.id,
      name: data.name,
      color: data.color,
      emoji: data.emoji,
      description: data.description || undefined,
    }
  }

  static toRo(data: any): CalendarRo {
    return this.toSimpleRo(data)
  }

  static toFullRo(data: any): CalendarFullRo {
    return this.toSimpleRo(data)
  }
}

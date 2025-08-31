import {
  CalendarEntityFullSelect,
  CalendarEntitySelect,
  CalendarEntitySimpleSelect,
} from "@/entities/calendar"
import { UserEntity } from "@/entities/user"
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

  static toRo(data: CalendarEntitySelect): CalendarRo {
    return {
      ...this.toSimpleRo(data),
      isDefault: data.isDefault,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      userId: data.userId,
    }
  }

  static toFullRo(data: CalendarEntityFullSelect): CalendarFullRo {
    return {
      ...this.toRo(data),
      user: data.user ? UserEntity.toSimpleRo(data.user) : undefined,
    }
  }
}

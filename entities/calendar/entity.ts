import {
  CalendarFullRo,
  CalendarRo,
  CalendarSimpleRo,
} from "@/schemas/calendar"

/**
 * Calendar Entity - Pure data transformation for Calendar operations
 */
export class CalendarEntity {
  /**
   * Convert database result to CalendarSimpleRo
   */
  static toSimpleRo(data: any): CalendarSimpleRo {
    return {
      id: data.id,
      name: data.name,
      color: data.color,
      emoji: data.emoji,
      isDefault: data.isDefault,
      isActive: data.isActive,
      description: data.description || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      userId: data.userId,
    }
  }

  /**
   * Convert database result to CalendarRo
   */
  static toRo(data: any): CalendarRo {
    return this.toSimpleRo(data)
  }

  /**
   * Convert database result to CalendarFullRo
   */
  static toFullRo(data: any): CalendarFullRo {
    return this.toSimpleRo(data)
  }
}

import { Prisma } from "@/prisma/client"

/**
 * Calendar Query Selectors - Prisma select objects for different use cases
 */
export class CalendarQuery {
  /**
   * Simple select - basic calendar fields without relations
   */
  static getSimpleSelect() {
    return {
      id: true,
      name: true,
      color: true,
      emoji: true,
      isDefault: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    } satisfies Prisma.CalendarSelect
  }

  /**
   * Standard select - same as simple for calendar
   */
  static getStandardSelect() {
    return this.getSimpleSelect()
  }

  /**
   * Full select - same as simple for calendar (no additional relations for now)
   */
  static getFullSelect() {
    return this.getSimpleSelect()
  }
}

// Type definitions for the select results
export type CalendarEntitySimpleSelect = Prisma.CalendarGetPayload<{
  select: ReturnType<typeof CalendarQuery.getSimpleSelect>
}>

export type CalendarEntityStandardSelect = Prisma.CalendarGetPayload<{
  select: ReturnType<typeof CalendarQuery.getStandardSelect>
}>

export type CalendarEntityFullSelect = Prisma.CalendarGetPayload<{
  select: ReturnType<typeof CalendarQuery.getFullSelect>
}>

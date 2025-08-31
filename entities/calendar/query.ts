import { Prisma } from "@/prisma/client"

export type CalendarEntitySimpleSelect = Prisma.CalendarGetPayload<{
  select: ReturnType<typeof CalendarQuery.getSimpleSelect>
}>

export type CalendarEntitySelect = Prisma.CalendarGetPayload<{
  select: ReturnType<typeof CalendarQuery.getSelect>
}>

export class CalendarQuery {
  static getSimpleSelect() {
    return {
      id: true,
      name: true,
      description: true,
      color: true,
      emoji: true,
    } satisfies Prisma.CalendarSelect
  }

  static getSelect() {
    return {
      ...this.getSimpleSelect(),
      isDefault: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    } satisfies Prisma.CalendarSelect
  }

  static getSimpleInclude() {
    return {} satisfies Prisma.CalendarInclude
  }

  static getInclude() {
    return {
      events: true,
    } satisfies Prisma.CalendarInclude
  }

  static getFullInclude() {
    return {
      ...this.getInclude(),
      user: true,
    } satisfies Prisma.CalendarInclude
  }
}

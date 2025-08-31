import { Prisma } from "@/prisma/client"

export type RecurrenceEntitySimpleSelect = Prisma.EventRecurrenceGetPayload<{
  select: ReturnType<typeof RecurrenceQuery.getSimpleSelect>
}>

export type RecurrenceEntitySelect = Prisma.EventRecurrenceGetPayload<{
  select: ReturnType<typeof RecurrenceQuery.getSelect>
}>

export type RecurrenceEntityFullSelect = Prisma.EventRecurrenceGetPayload<{
  select: ReturnType<typeof RecurrenceQuery.getFullSelect>
}>

export class RecurrenceQuery {
  static getSimpleSelect() {
    return {
      id: true,
      pattern: true,
      endDate: true,
      customRule: true,
      createdAt: true,
      updatedAt: true,
      eventId: true,
    } satisfies Prisma.EventRecurrenceSelect
  }

  static getSelect() {
    return this.getSimpleSelect()
  }

  static getFullSelect() {
    return this.getSimpleSelect()
  }
}

import { Prisma } from "@/prisma/client"

export type RecurrenceEntitySimpleSelect = Prisma.EventRecurrenceGetPayload<{
  select: ReturnType<typeof RecurrenceQuery.getSimpleSelect>
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
}

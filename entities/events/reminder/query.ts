import { Prisma } from "@/prisma/client"

export type ReminderEntitySimpleSelect = Prisma.EventReminderGetPayload<{
  select: ReturnType<typeof ReminderQuery.getSimpleSelect>
}>

export class ReminderQuery {
  static getSimpleSelect() {
    return {
      id: true,
      value: true,
      unit: true,
      createdAt: true,
      updatedAt: true,
      eventId: true,
    } satisfies Prisma.EventReminderSelect
  }
}

import { Prisma } from "@/prisma/client"

export type ReminderEntitySimpleSelect = Prisma.EventReminderGetPayload<{
  select: ReturnType<typeof ReminderQuery.getSimpleSelect>
}>

export type ReminderEntitySelect = Prisma.EventReminderGetPayload<{
  select: ReturnType<typeof ReminderQuery.getSelect>
}>

export type ReminderEntityFullSelect = Prisma.EventReminderGetPayload<{
  select: ReturnType<typeof ReminderQuery.getFullSelect>
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

  static getSelect() {
    return this.getSimpleSelect()
  }

  static getFullSelect() {
    return this.getSimpleSelect()
  }
}

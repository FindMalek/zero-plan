import { CalendarQuery } from "@/entities/calendar"
import { Prisma } from "@/prisma/client"

import { ConferenceQuery } from "./conference"
import { ParticipantQuery } from "./participant"
import { RecurrenceQuery } from "./recurrence"
import { ReminderQuery } from "./reminder"

export type EventEntitySimpleSelect = Prisma.EventGetPayload<{
  select: ReturnType<typeof EventQuery.getSimpleSelect>
}>

export type EventEntitySelect = Prisma.EventGetPayload<{
  select: ReturnType<typeof EventQuery.getSelect>
}>

export type EventEntityFullSelect = Prisma.EventGetPayload<{
  select: ReturnType<typeof EventQuery.getFullSelect>
}>

export class EventQuery {
  static getSimpleSelect() {
    return {
      id: true,
      emoji: true,
      title: true,
      description: true,
      startTime: true,
      endTime: true,
      timezone: true,
      isAllDay: true,
      location: true,
      maxParticipants: true,
      links: true,
      aiConfidence: true,
    } satisfies Prisma.EventSelect
  }

  static getSelect() {
    return {
      ...this.getSimpleSelect(),
      calendar: {
        select: CalendarQuery.getSimpleSelect(),
      },
    } satisfies Prisma.EventSelect
  }

  static getFullSelect() {
    return {
      ...this.getSelect(),
      recurrence: {
        select: RecurrenceQuery.getSimpleSelect(),
      },
      reminders: {
        select: ReminderQuery.getSimpleSelect(),
      },
      conference: {
        select: ConferenceQuery.getSimpleSelect(),
      },
      participants: {
        select: ParticipantQuery.getSimpleSelect(),
      },
    } satisfies Prisma.EventSelect
  }
}

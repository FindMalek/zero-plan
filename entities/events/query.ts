import { CalendarQuery } from "@/entities/calendar"
import { Prisma } from "@/prisma/client"

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
        select: {
          id: true,
          pattern: true,
          endDate: true,
          customRule: true,
          createdAt: true,
          updatedAt: true,
          eventId: true,
        },
      },
      reminders: {
        select: {
          id: true,
          value: true,
          unit: true,
          createdAt: true,
          updatedAt: true,
          eventId: true,
        },
      },
      conference: {
        select: {
          id: true,
          meetingRoom: true,
          conferenceLink: true,
          conferenceId: true,
          dialInNumber: true,
          accessCode: true,
          hostKey: true,
          isRecorded: true,
          maxDuration: true,
          createdAt: true,
          updatedAt: true,
          eventId: true,
        },
      },
      participants: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          rsvpStatus: true,
          isOrganizer: true,
          notes: true,
          invitedAt: true,
          respondedAt: true,
          createdAt: true,
          updatedAt: true,
          eventId: true,
        },
      },
    } satisfies Prisma.EventSelect
  }
}

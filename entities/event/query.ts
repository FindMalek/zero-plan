import { Prisma } from "@/prisma/client"

export type EventEntitySimpleSelect = Prisma.EventGetPayload<{
  select: ReturnType<typeof EventQuery.getSimpleSelect>
}>

export type EventEntityStandardSelect = Prisma.EventGetPayload<{
  select: ReturnType<typeof EventQuery.getStandardSelect>
}>

export type EventEntityFullSelect = Prisma.EventGetPayload<{
  select: ReturnType<typeof EventQuery.getFullSelect>
}>

/**
 * Event Query Selectors - Prisma select objects for different use cases
 */
export class EventQuery {
  /**
   * Simple select - basic event fields without relations
   */
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
      createdAt: true,
      updatedAt: true,
      userId: true,
      calendarId: true,
    } satisfies Prisma.EventSelect
  }

  /**
   * Standard select - includes calendar info
   */
  static getStandardSelect() {
    return {
      ...this.getSimpleSelect(),
      calendar: {
        select: {
          id: true,
          name: true,
          color: true,
          emoji: true,
        },
      },
    } satisfies Prisma.EventSelect
  }

  /**
   * Full select - includes all relations
   */
  static getFullSelect() {
    return {
      ...this.getSimpleSelect(),
      calendar: {
        select: {
          id: true,
          name: true,
          color: true,
          emoji: true,
          userId: true,
        },
      },
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

// Type definitions for the select results

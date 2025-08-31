import { CalendarEntity } from "@/entities/calendar"
import { EventFullRo, EventRo, EventSimpleRo } from "@/schemas/event"

import {
  EventEntityFullSelect,
  EventEntitySelect,
  EventEntitySimpleSelect,
} from "./query"

export class EventEntity {
  static toSimpleRo(data: EventEntitySimpleSelect): EventSimpleRo {
    return {
      id: data.id,
      emoji: data.emoji,
      title: data.title,
      description: data.description || undefined,
      startTime: data.startTime,
      endTime: data.endTime || undefined,
      timezone: data.timezone,
      isAllDay: data.isAllDay,
      location: data.location || undefined,
      maxParticipants: data.maxParticipants || undefined,
      links: data.links,
    }
  }

  static toRo(data: EventEntitySelect): EventRo {
    return {
      ...this.toSimpleRo(data),
      calendar: data.calendar
        ? CalendarEntity.toSimpleRo(data.calendar)
        : undefined,
    }
  }

  static toFullRo(data: EventEntityFullSelect): EventFullRo {
    return {
      ...this.toSimpleRo(data),
      calendar: data.calendar
        ? CalendarEntity.toSimpleRo(data.calendar)
        : undefined,
      recurrence: data.recurrence
        ? {
            id: data.recurrence.id,
            pattern: data.recurrence.pattern,
            endDate: data.recurrence.endDate || undefined,
            customRule: data.recurrence.customRule as
              | Record<string, string | number | boolean>
              | undefined,
            createdAt: data.recurrence.createdAt,
            updatedAt: data.recurrence.updatedAt,
            eventId: data.recurrence.eventId,
          }
        : undefined,
      reminders: data.reminders?.map((reminder: any) => ({
        id: reminder.id,
        value: reminder.value,
        unit: reminder.unit,
        createdAt: reminder.createdAt,
        updatedAt: reminder.updatedAt,
        eventId: reminder.eventId,
      })),
      conference: data.conference
        ? {
            id: data.conference.id,
            meetingRoom: data.conference.meetingRoom || undefined,
            conferenceLink: data.conference.conferenceLink || undefined,
            conferenceId: data.conference.conferenceId || undefined,
            dialInNumber: data.conference.dialInNumber || undefined,
            accessCode: data.conference.accessCode || undefined,
            hostKey: data.conference.hostKey || undefined,
            isRecorded: data.conference.isRecorded,
            maxDuration: data.conference.maxDuration || undefined,
            createdAt: data.conference.createdAt,
            updatedAt: data.conference.updatedAt,
            eventId: data.conference.eventId,
          }
        : undefined,
      participants: data.participants?.map((participant: any) => ({
        id: participant.id,
        email: participant.email,
        name: participant.name || undefined,
        role: participant.role,
        rsvpStatus: participant.rsvpStatus,
        isOrganizer: participant.isOrganizer,
        notes: participant.notes || undefined,
        invitedAt: participant.invitedAt,
        respondedAt: participant.respondedAt || undefined,
        createdAt: participant.createdAt,
        updatedAt: participant.updatedAt,
        eventId: participant.eventId,
      })),
    }
  }
}

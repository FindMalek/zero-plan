import { CalendarEntity } from "@/entities/calendar"
import { EventFullRo, EventRo, EventSimpleRo } from "@/schemas/event"

import { ConferenceEntity } from "./conference"
import { ParticipantEntity } from "./participant"
import {
  EventEntityFullSelect,
  EventEntitySelect,
  EventEntitySimpleSelect,
} from "./query"
import { RecurrenceEntity } from "./recurrence"
import { ReminderEntity } from "./reminder"

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
      aiConfidence: data.aiConfidence || undefined,
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
        ? RecurrenceEntity.toSimpleRo(data.recurrence)
        : undefined,
      reminders: data.reminders?.map((reminder) =>
        ReminderEntity.toSimpleRo(reminder)
      ),
      conference: data.conference
        ? ConferenceEntity.toSimpleRo(data.conference)
        : undefined,
      participants: data.participants?.map((participant) =>
        ParticipantEntity.toSimpleRo(participant)
      ),
    }
  }
}

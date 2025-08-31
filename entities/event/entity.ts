import { EventFullRo, EventRo, EventSimpleRo } from "@/schemas/event"

/**
 * Event Entity - Pure data transformation for Event operations
 */
export class EventEntity {
  /**
   * Convert database result to EventSimpleRo
   */
  static toSimpleRo(data: any): EventSimpleRo {
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
      links: data.links || [],
      documents: data.documents || [],
      aiConfidence: data.aiConfidence || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      userId: data.userId,
      calendarId: data.calendarId,
    }
  }

  /**
   * Convert database result to EventRo (with calendar info)
   */
  static toRo(data: any): EventRo {
    return {
      ...this.toSimpleRo(data),
      calendar: data.calendar
        ? {
            id: data.calendar.id,
            name: data.calendar.name,
            color: data.calendar.color,
            emoji: data.calendar.emoji,
          }
        : undefined,
    }
  }

  /**
   * Convert database result to EventFullRo (with all relations)
   */
  static toFullRo(data: any): EventFullRo {
    return {
      ...this.toSimpleRo(data),
      calendar: data.calendar
        ? {
            id: data.calendar.id,
            name: data.calendar.name,
            color: data.calendar.color,
            emoji: data.calendar.emoji,
            userId: data.calendar.userId,
          }
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

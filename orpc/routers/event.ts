import { EventEntity, EventQuery } from "@/entities/events"
import { database } from "@/prisma/client"
import {
  createEventDto,
  CreateEventDto,
  createEventRo,
  CreateEventRo,
  deleteEventDto,
  DeleteEventDto,
  deleteEventRo,
  DeleteEventRo,
  getEventDto,
  GetEventDto,
  getEventRo,
  GetEventRo,
  listEventsDto,
  ListEventsDto,
  listEventsRo,
  ListEventsRo,
  updateEventDto,
  UpdateEventDto,
  updateEventRo,
  UpdateEventRo,
} from "@/schemas/event"
import {
  processEventsDto,
  ProcessEventsDto,
  processEventsRo,
  ProcessEventsRo,
} from "@/schemas/processing"
import { ORPCError, os } from "@orpc/server"

import type { ORPCContext } from "../types"

const baseProcedure = os.$context<ORPCContext>()

const privateProcedure = baseProcedure.use(({ context, next }) => {
  if (!context.user) {
    throw new ORPCError("UNAUTHORIZED")
  }

  return next({ context: { ...context, user: context.user } })
})

// Create Event
export const createEvent = privateProcedure
  .input(createEventDto)
  .output(createEventRo)
  .handler(async ({ input, context }): Promise<CreateEventRo> => {
    try {
      const startTime =
        typeof input.startTime === "string"
          ? new Date(input.startTime)
          : input.startTime
      const endTime = input.endTime
        ? typeof input.endTime === "string"
          ? new Date(input.endTime)
          : input.endTime
        : undefined

      // Validate that endTime is after startTime
      if (endTime && endTime <= startTime) {
        return {
          success: false,
          error: "End time must be after start time",
        }
      }

      // Create the event
      const event = await database.event.create({
        data: {
          emoji: input.emoji || "📅",
          title: input.title,
          description: input.description,
          startTime,
          endTime,
          timezone: input.timezone || "UTC",
          isAllDay: input.isAllDay || false,
          location: input.location,
          maxParticipants: input.maxParticipants,
          links: input.links || [],
          userId: context.user.id,
          calendarId: input.calendarId,
        },
        select: EventQuery.getSelect(),
      })

      // Create conference details if provided
      if (input.conference) {
        await database.eventConference.create({
          data: {
            eventId: event.id,
            meetingRoom: input.conference.meetingRoom,
            conferenceLink: input.conference.conferenceLink,
            conferenceId: input.conference.conferenceId,
            dialInNumber: input.conference.dialInNumber,
            accessCode: input.conference.accessCode,
            hostKey: input.conference.hostKey,
            isRecorded: input.conference.isRecorded || false,
            maxDuration: input.conference.maxDuration,
          },
        })
      }

      // Create participants if provided
      if (input.participants) {
        const participantsData = input.participants.map((participant) => ({
          eventId: event.id,
          email: participant.email,
          name: participant.name,
          role: participant.role || "ATTENDEE",
          rsvpStatus: participant.rsvpStatus || "PENDING",
          isOrganizer: participant.isOrganizer || false,
          notes: participant.notes,
        }))

        await database.eventParticipant.createMany({
          data: participantsData,
        })
      }

      // Create recurrence if provided
      if (input.recurrence) {
        await database.eventRecurrence.create({
          data: {
            eventId: event.id,
            pattern: input.recurrence.pattern,
            endDate: input.recurrence.endDate
              ? typeof input.recurrence.endDate === "string"
                ? new Date(input.recurrence.endDate)
                : input.recurrence.endDate
              : undefined,
            customRule: input.recurrence.customRule,
          },
        })
      }

      // Create reminders if provided
      if (input.reminders) {
        const remindersData = input.reminders.map((reminder) => ({
          eventId: event.id,
          value: reminder.value,
          unit: reminder.unit,
        }))

        await database.eventReminder.createMany({
          data: remindersData,
        })
      }

      return {
        success: true,
        event: EventEntity.toRo(event),
      }
    } catch (error: any) {
      if (error instanceof ORPCError) {
        throw error
      }

      console.error("Database error creating event:", error)
      return {
        success: false,
        error: "Database error occurred while creating event",
      }
    }
  })

// Get Event
export const getEvent = privateProcedure
  .input(getEventDto)
  .output(getEventRo)
  .handler(async ({ input, context }): Promise<GetEventRo> => {
    try {
      const event = await database.event.findFirst({
        where: {
          id: input.id,
          userId: context.user.id,
        },
        select: EventQuery.getFullSelect(),
      })

      if (!event) {
        return {
          success: false,
          error: "Event not found or you don't have permission to view it",
        }
      }

      return {
        success: true,
        event: EventEntity.toFullRo(event),
      }
    } catch (error: any) {
      if (error instanceof ORPCError) {
        throw error
      }

      console.error("Unexpected error getting event:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      }
    }
  })

// Update Event
export const updateEvent = privateProcedure
  .input(updateEventDto)
  .output(updateEventRo)
  .handler(async ({ input, context }): Promise<UpdateEventRo> => {
    try {
      // Check if event exists and belongs to user
      const existingEvent = await database.event.findFirst({
        where: {
          id: input.id,
          userId: context.user.id,
        },
      })

      if (!existingEvent) {
        return {
          success: false,
          error: "Event not found or you don't have permission to update it",
        }
      }

      const startTime = input.startTime
        ? typeof input.startTime === "string"
          ? new Date(input.startTime)
          : input.startTime
        : undefined
      const endTime = input.endTime
        ? typeof input.endTime === "string"
          ? new Date(input.endTime)
          : input.endTime
        : undefined

      // Validate that endTime is after startTime if both are provided
      if (startTime && endTime && endTime <= startTime) {
        return {
          success: false,
          error: "End time must be after start time",
        }
      }

      const updateData: any = {}
      if (input.emoji !== undefined) updateData.emoji = input.emoji
      if (input.title !== undefined) updateData.title = input.title
      if (input.description !== undefined)
        updateData.description = input.description
      if (startTime !== undefined) updateData.startTime = startTime
      if (endTime !== undefined) updateData.endTime = endTime
      if (input.timezone !== undefined) updateData.timezone = input.timezone
      if (input.isAllDay !== undefined) updateData.isAllDay = input.isAllDay
      if (input.location !== undefined) updateData.location = input.location
      if (input.maxParticipants !== undefined)
        updateData.maxParticipants = input.maxParticipants
      if (input.links !== undefined) updateData.links = input.links
      if (input.calendarId !== undefined)
        updateData.calendarId = input.calendarId

      const event = await database.event.update({
        where: { id: input.id },
        data: updateData,
        select: EventQuery.getSelect(),
      })

      // Update conference if provided
      if (input.conference) {
        await database.eventConference.upsert({
          where: { eventId: input.id },
          update: {
            meetingRoom: input.conference.meetingRoom,
            conferenceLink: input.conference.conferenceLink,
            conferenceId: input.conference.conferenceId,
            dialInNumber: input.conference.dialInNumber,
            accessCode: input.conference.accessCode,
            hostKey: input.conference.hostKey,
            isRecorded: input.conference.isRecorded || false,
            maxDuration: input.conference.maxDuration,
          },
          create: {
            eventId: input.id,
            meetingRoom: input.conference.meetingRoom,
            conferenceLink: input.conference.conferenceLink,
            conferenceId: input.conference.conferenceId,
            dialInNumber: input.conference.dialInNumber,
            accessCode: input.conference.accessCode,
            hostKey: input.conference.hostKey,
            isRecorded: input.conference.isRecorded || false,
            maxDuration: input.conference.maxDuration,
          },
        })
      }

      // Update participants if provided
      if (input.participants) {
        // Delete existing participants
        await database.eventParticipant.deleteMany({
          where: { eventId: input.id },
        })

        // Create new participants
        const participantsData = input.participants.map((participant) => ({
          eventId: input.id,
          email: participant.email,
          name: participant.name,
          role: participant.role || "ATTENDEE",
          rsvpStatus: participant.rsvpStatus || "PENDING",
          isOrganizer: participant.isOrganizer || false,
          notes: participant.notes,
        }))

        await database.eventParticipant.createMany({
          data: participantsData,
        })
      }

      return {
        success: true,
        event: EventEntity.toRo(event),
      }
    } catch (error: any) {
      if (error instanceof ORPCError) {
        throw error
      }

      console.error("Database error updating event:", error)
      return {
        success: false,
        error: "Database error occurred while updating event",
      }
    }
  })

// Delete Event
export const deleteEvent = privateProcedure
  .input(deleteEventDto)
  .output(deleteEventRo)
  .handler(async ({ input, context }): Promise<DeleteEventRo> => {
    try {
      // Check if event exists and belongs to user
      const existingEvent = await database.event.findFirst({
        where: {
          id: input.id,
          userId: context.user.id,
        },
      })

      if (!existingEvent) {
        return {
          success: false,
          error: "Event not found or you don't have permission to delete it",
        }
      }

      await database.event.delete({
        where: { id: input.id },
      })

      return {
        success: true,
      }
    } catch (error: any) {
      if (error instanceof ORPCError) {
        throw error
      }

      console.error("Database error deleting event:", error)
      return {
        success: false,
        error: "Database error occurred while deleting event",
      }
    }
  })

// List Events
export const listEvents = baseProcedure
  .input(listEventsDto)
  .output(listEventsRo)
  .handler(async ({ input, context }): Promise<ListEventsRo> => {
    try {
      // Use fallback user ID for demo purposes (same pattern as AI router)
      const userId = context.user?.id || "user_1"

      const where: any = {
        userId: userId,
      }

      // Add filters
      if (input.calendarId) {
        where.calendarId = input.calendarId
      }
      if (input.search) {
        where.OR = [
          { title: { contains: input.search, mode: "insensitive" } },
          { description: { contains: input.search, mode: "insensitive" } },
          { location: { contains: input.search, mode: "insensitive" } },
        ]
      }
      if (input.startDate || input.endDate) {
        where.startTime = {}
        if (input.startDate) {
          const startDate =
            typeof input.startDate === "string"
              ? new Date(input.startDate)
              : input.startDate
          where.startTime.gte = startDate
        }
        if (input.endDate) {
          const endDate =
            typeof input.endDate === "string"
              ? new Date(input.endDate)
              : input.endDate
          where.startTime.lte = endDate
        }
      }

      const [events, total] = await Promise.all([
        database.event.findMany({
          where,
          include: {
            calendar: {
              select: {
                id: true,
                name: true,
                color: true,
                emoji: true,
              },
            },
          },
          orderBy: { startTime: "asc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        database.event.count({ where }),
      ])

      const eventsRo = events.map((event) => ({
        id: event.id,
        emoji: event.emoji,
        title: event.title,
        description: event.description || undefined,
        startTime: event.startTime,
        endTime: event.endTime || undefined,
        timezone: event.timezone,
        isAllDay: event.isAllDay,
        location: event.location || undefined,
        maxParticipants: event.maxParticipants || undefined,
        links: event.links,
        aiConfidence: event.aiConfidence || undefined,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        userId: event.userId,
        calendarId: event.calendarId,
        calendar: event.calendar,
      }))

      const totalPages = Math.ceil(total / input.limit)

      return {
        success: true,
        events: eventsRo,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages,
        },
      }
    } catch (error) {
      if (error instanceof ORPCError) {
        throw error
      }

      console.error("Unexpected error listing events:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      }
    }
  })

export const eventRouter = {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  listEvents,
}

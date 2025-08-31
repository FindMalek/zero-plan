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
import { createOpenAI } from "@ai-sdk/openai"
import { ORPCError, os } from "@orpc/server"
import { generateText } from "ai"
import { z } from "zod"


import { client as aiClient } from "@/config/openai"

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
        event: {
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
        },
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
        include: {
          calendar: {
            select: {
              id: true,
              name: true,
              color: true,
              emoji: true,
              userId: true,
            },
          },
          recurrence: true,
          reminders: true,
          conference: true,
          participants: true,
        },
      })

      if (!event) {
        return {
          success: false,
          error: "Event not found or you don't have permission to view it",
        }
      }

      return {
        success: true,
        event: {
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
          recurrence: event.recurrence
            ? {
                id: event.recurrence.id,
                pattern: event.recurrence.pattern,
                endDate: event.recurrence.endDate || undefined,
                customRule: event.recurrence.customRule as
                  | Record<string, string | number | boolean>
                  | undefined,
                createdAt: event.recurrence.createdAt,
                updatedAt: event.recurrence.updatedAt,
                eventId: event.recurrence.eventId,
              }
            : undefined,
          reminders: event.reminders.map((reminder) => ({
            id: reminder.id,
            value: reminder.value,
            unit: reminder.unit,
            createdAt: reminder.createdAt,
            updatedAt: reminder.updatedAt,
            eventId: reminder.eventId,
          })),
          conference: event.conference
            ? {
                id: event.conference.id,
                meetingRoom: event.conference.meetingRoom || undefined,
                conferenceLink: event.conference.conferenceLink || undefined,
                conferenceId: event.conference.conferenceId || undefined,
                dialInNumber: event.conference.dialInNumber || undefined,
                accessCode: event.conference.accessCode || undefined,
                hostKey: event.conference.hostKey || undefined,
                isRecorded: event.conference.isRecorded,
                maxDuration: event.conference.maxDuration || undefined,
                createdAt: event.conference.createdAt,
                updatedAt: event.conference.updatedAt,
                eventId: event.conference.eventId,
              }
            : undefined,
          participants: event.participants.map((participant) => ({
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
        },
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
        event: {
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
        },
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
export const listEvents = privateProcedure
  .input(listEventsDto)
  .output(listEventsRo)
  .handler(async ({ input, context }): Promise<ListEventsRo> => {
    try {
      const where: any = {
        userId: context.user.id,
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

// Process Events (temporarily public for MVP testing)
export const processEvents = baseProcedure
  .input(processEventsDto)
  .output(processEventsRo)
  .handler(async ({ input, context }): Promise<ProcessEventsRo> => {
    try {
      const startTime = Date.now()

      try {
        // Parse dates relative to current time
        const now = new Date()
        const currentDateTime = now.toISOString()

        // Use VoidAI to process the event with structured output
        const response = await generateText({
          model: aiClient.chat("gpt-4o-mini"),
          messages: [
            {
              role: "user",
              content: `You are an intelligent event planning assistant. Parse natural language input into structured events with emoji-prefixed titles. Always respond with valid JSON only.

Current date and time: ${currentDateTime}

CRITICAL RULES:
1. **EMOJI TITLES**: Always prefix titles with 1-2 relevant emojis that describe the event
   Examples: "☕ Coffee with John", "🏦 Bank appointment", "🚲 Bike ride", "💼 Team meeting", "🎉 Birthday party"

2. **MULTIPLE EVENTS**: If the input describes multiple events/activities, create separate event objects
   Example: "Coffee at 9am then gym at 11am" → create 2 events

3. **MEANINGFUL DESCRIPTIONS**: 
   - Write real, helpful descriptions (not placeholders)
   - Include specific details, tasks, or context from the input
   - Use HTML formatting for lists: <ul><li>item</li></ul> or <p>paragraph</p>
   - Leave empty if no meaningful detail can be extracted

4. **SMART TIME PARSING**:
   - Parse relative times: "tomorrow", "next week", "in 2 hours", "3pm today"
   - Default times: meetings (9am), appointments (3pm), social (7pm), workouts (6am)
   - Default durations: meetings (1-2h), appointments (30-60m), social (2-3h), workouts (1h)

Input to parse: "${input.userInput}"

Parse this into events with emoji-prefixed titles and meaningful descriptions. Be smart about multiple events and context clues.

RESPOND WITH VALID JSON ONLY in this exact format:
{
  "events": [
    {
      "title": "🎯 Emoji prefixed title",
      "description": "Meaningful description with details",
      "startTime": "ISO datetime",
      "endTime": "ISO datetime (optional)",
      "location": "location if mentioned",
      "confidence": 0.8
    }
  ]
}`,
            },
          ],
        })

        // Parse the JSON response
        let result: { object: { events: any[] } }
        try {
          const parsed = JSON.parse(response.text)
          result = { object: parsed }
        } catch (parseError) {
          console.error("Failed to parse AI response:", parseError)
          // Fallback if JSON parsing fails
          result = {
            object: {
              events: [
                {
                  title: `📅 ${input.userInput}`,
                  description:
                    "Event created from user input (AI parsing failed)",
                  startTime: new Date(
                    Date.now() + 24 * 60 * 60 * 1000
                  ).toISOString(),
                  endTime: new Date(
                    Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000
                  ).toISOString(),
                  location: undefined,
                  confidence: 0.5,
                },
              ],
            },
          }
        }

        const processingTime = Date.now() - startTime

        // For MVP testing - ensure test user exists if no user is authenticated
        let userId = context.user?.id

        if (!userId) {
          // Create or get test user for MVP
          const testUserId = "test-user-id"
          const existingUser = await database.user.findUnique({
            where: { id: testUserId },
          })

          if (!existingUser) {
            await database.user.create({
              data: {
                id: testUserId,
                email: "test@zeroplanner.dev",
                name: "Test User",
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            })
          }
          userId = testUserId
        }

        // Get or create user's default calendar
        let defaultCalendar = await database.calendar.findFirst({
          where: {
            userId: userId,
            name: "Personal", // Default calendar name
          },
        })

        if (!defaultCalendar) {
          defaultCalendar = await database.calendar.create({
            data: {
              name: "Personal",
              color: "#3B82F6", // Blue color
              emoji: "📅",
              userId: userId,
            },
          })
        }

        // Create processing session
        const processingSession = await database.inputProcessingSession.create({
          data: {
            userInput: input.userInput,
            processedOutput: result.object,
            model: "gpt-4o-mini", // Default model
            provider: "voidai", // Default provider
            status: "COMPLETED",
            processingTimeMs: processingTime,
            confidence:
              result.object.events.reduce(
                (sum, event) => sum + event.confidence,
                0
              ) / result.object.events.length,
            userId: userId,
          },
        })

        // Create all events from AI processing
        const createdEvents = []

        for (const eventData of result.object.events) {
          // Create each event
          const event = await database.event.create({
            data: {
              emoji: eventData.title.split(" ")[0], // Extract emoji from title
              title: eventData.title,
              description: eventData.description,
              startTime: new Date(eventData.startTime),
              endTime: eventData.endTime
                ? new Date(eventData.endTime)
                : undefined,
              location: eventData.location,
              aiConfidence: eventData.confidence,
              userId: userId,
              calendarId: defaultCalendar.id,
              links: [], // Default empty array
            },
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
          })

          createdEvents.push({
            id: event.id,
            title: event.title,
            emoji: event.emoji,
            startTime: event.startTime,
            endTime: event.endTime || undefined,
            calendarId: event.calendarId,
          })
        }

        return {
          success: true,
          events: createdEvents,
          processingSession: {
            id: processingSession.id,
            status: processingSession.status,
            createdAt: processingSession.createdAt,
            updatedAt: processingSession.updatedAt,
            userId: processingSession.userId,
            userInput: processingSession.userInput,
            model: processingSession.model,
            provider: processingSession.provider,
            processingTimeMs: processingSession.processingTimeMs || undefined,
            tokensUsed: processingSession.tokensUsed || undefined,
            confidence: processingSession.confidence || undefined,
            errorMessage: processingSession.errorMessage || undefined,
            eventsCreated: createdEvents.length,
          },
          totalEvents: createdEvents.length,
        }
      } catch (aiError: any) {
        console.error("AI processing error:", aiError)
        return {
          success: false,
          error:
            "Failed to process event with AI. Please try again or create the event manually.",
        }
      }
    } catch (error: any) {
      if (error instanceof ORPCError) {
        throw error
      }

      console.error("Unexpected error in AI processing:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      }
    }
  })

// Export the event router
export const eventRouter = {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  listEvents,
  processEvents,
}

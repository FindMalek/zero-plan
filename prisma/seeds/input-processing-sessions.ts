import { Prisma, PrismaClient, ProcessingStatus } from "@prisma/client"

async function seedInputProcessingSessions(prisma: PrismaClient) {
  console.log("🌱 Seeding input processing sessions...")

  const users = await prisma.user.findMany()
  const events = await prisma.event.findMany()

  // Prepare all input processing session data for batch operations
  const processingsToCreate: Prisma.InputProcessingSessionCreateManyInput[] = []

  for (const user of users) {
    const userEvents = events.filter(
      (e) => e.userId === user.id && e.aiConfidence
    )

    // Create input processing sessions for events that have AI confidence scores
    for (const event of userEvents) {
      let userInput = ""
      let processedOutput: any = {}

      // Generate realistic user inputs and AI outputs based on the event
      if (event.title.includes("Grocery Shopping")) {
        userInput =
          "I need to buy groceries this Saturday morning at 10am at Whole Foods"
        processedOutput = {
          events: [
            {
              title: "Grocery Shopping",
              description: "Weekly grocery shopping at the local supermarket",
              startTime: "2024-01-20T10:00:00Z",
              endTime: "2024-01-20T11:30:00Z",
              location: "Whole Foods Market",
              emoji: "🛒",
            },
          ],
          confidence: 0.85,
          extractedEntities: {
            time: "Saturday morning at 10am",
            location: "Whole Foods",
            activity: "grocery shopping",
          },
        }
      } else if (event.title.includes("Team Standup")) {
        userInput =
          "Schedule daily team standup meetings at 9am in conference room A with zoom link"
        processedOutput = {
          events: [
            {
              title: "Daily Team Standup",
              description:
                "Daily team sync meeting to discuss progress and blockers",
              startTime: "2024-01-15T09:00:00Z",
              endTime: "2024-01-15T09:30:00Z",
              meetingRoom: "Conference Room A",
              emoji: "💼",
              conferenceLink: "https://zoom.us/j/123456789",
            },
          ],
          confidence: 0.92,
          extractedEntities: {
            frequency: "daily",
            time: "9am",
            location: "conference room A",
            meeting_type: "team standup",
          },
        }
      } else if (event.title.includes("Dentist")) {
        userInput = "Book dentist appointment next Monday at 10am for cleaning"
        processedOutput = {
          events: [
            {
              title: "Dentist Appointment",
              description: "Regular dental checkup and cleaning",
              startTime: "2024-01-22T10:00:00Z",
              endTime: "2024-01-22T11:00:00Z",
              emoji: "🦷",
            },
          ],
          confidence: 0.78,
          extractedEntities: {
            appointment_type: "dentist",
            time: "next Monday at 10am",
            service: "cleaning",
          },
        }
      } else if (event.title.includes("Birthday Party")) {
        userInput =
          "Sarah's 30th birthday party this Saturday evening from 6pm to 10pm at her house"
        processedOutput = {
          events: [
            {
              title: "Sarah's Birthday Party",
              description:
                "Celebrating Sarah's 30th birthday with friends and family",
              startTime: "2024-01-27T18:00:00Z",
              endTime: "2024-01-27T22:00:00Z",
              location: "Sarah's House",
              emoji: "🎂",
            },
          ],
          confidence: 0.88,
          extractedEntities: {
            person: "Sarah",
            event_type: "birthday party",
            age: "30th",
            time: "Saturday evening from 6pm to 10pm",
            location: "her house",
          },
        }
      } else {
        // Default generic processing session
        userInput = `Create event: ${event.title}`
        processedOutput = {
          events: [
            {
              title: event.title,
              description: event.description,
              startTime: event.startTime,
              endTime: event.endTime,
              location: event.location,
              emoji: event.emoji,
            },
          ],
          confidence: event.aiConfidence || 0.75,
          extractedEntities: {},
        }
      }

      processingsToCreate.push({
        id: `processing_session_${event.id}`,
        userInput,
        processedOutput: JSON.stringify(processedOutput),
        model: "gpt-4",
        provider: "openai",
        processingTimeMs: Math.floor(Math.random() * 3000) + 500, // Random between 500-3500ms
        tokensUsed: Math.floor(Math.random() * 200) + 50, // Random between 50-250 tokens
        confidence: event.aiConfidence || 0.75,
        status: ProcessingStatus.COMPLETED,
        createdAt: new Date(event.createdAt.getTime() - 5000), // 5 seconds before event creation
        updatedAt: new Date(event.createdAt.getTime() - 1000), // 1 second before event creation
        eventId: event.id,
        userId: user.id,
      })
    }

    // Add some failed processing sessions for realism
    if (user.email === "john@example.com") {
      processingsToCreate.push({
        id: `processing_session_failed_${user.id}`,
        userInput: "uhh maybe something tomorrow or the day after idk",
        processedOutput: JSON.stringify({
          error: "Unable to extract clear event information",
        }),
        model: "gpt-4",
        provider: "openai",
        processingTimeMs: 1200,
        tokensUsed: 45,
        confidence: 0.12,
        status: ProcessingStatus.FAILED,
        errorMessage:
          "Insufficient information to create event. User input was too vague.",
        createdAt: new Date(),
        updatedAt: new Date(),
        eventId: null,
        userId: user.id,
      })
    }
  }

  // Create all input processing sessions in batch
  if (processingsToCreate.length > 0) {
    await prisma.inputProcessingSession.createMany({
      data: processingsToCreate,
      skipDuplicates: true,
    })
  }

  console.log("✅ Input processing sessions seeded successfully")
}

export { seedInputProcessingSessions }

import {
  Timezone,
  Prisma,
  PrismaClient,
} from "@prisma/client"

async function seedEvents(prisma: PrismaClient) {
  console.log("🌱 Seeding events...")

  const users = await prisma.user.findMany()
  const calendars = await prisma.calendar.findMany()

  // Prepare all event data for batch operations
  const eventsToCreate: Prisma.EventCreateManyInput[] = []

  for (const user of users) {
    // Find calendars for this user
    const userCalendars = calendars.filter((c) => c.userId === user.id)
    const personalCalendar = userCalendars.find((c) => c.name === "Personal")
    const workCalendar = userCalendars.find((c) => c.name === "Work")
    const healthCalendar = userCalendars.find((c) => c.name === "Health")
    const socialCalendar = userCalendars.find((c) => c.name === "Social")

    if (personalCalendar) {
      eventsToCreate.push(
        // Personal events
        {
          id: `event_morning_routine_${user.id}`,
          emoji: "☀️",
          title: "Morning Routine",
          description: "Daily morning exercise and meditation",
          startTime: new Date("2024-01-15T07:00:00Z"),
          endTime: new Date("2024-01-15T08:00:00Z"),
          timezone: Timezone.AMERICA_NEW_YORK,
          isAllDay: false,
          location: "Home",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id,
          calendarId: personalCalendar.id,
        },
        {
          id: `event_grocery_shopping_${user.id}`,
          emoji: "🛒",
          title: "Grocery Shopping",
          description: "Weekly grocery shopping at the local supermarket",
          startTime: new Date("2024-01-20T10:00:00Z"),
          endTime: new Date("2024-01-20T11:30:00Z"),
          timezone: Timezone.AMERICA_NEW_YORK,
          isAllDay: false,
          location: "Whole Foods Market",
          aiConfidence: 0.85,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id,
          calendarId: personalCalendar.id,
        }
      )
    }

    if (workCalendar) {
      eventsToCreate.push(
        // Work events
        {
          id: `event_team_standup_${user.id}`,
          emoji: "💼",
          title: "Daily Team Standup",
          description: "Daily team sync meeting to discuss progress and blockers",
          startTime: new Date("2024-01-15T09:00:00Z"),
          endTime: new Date("2024-01-15T09:30:00Z"),
          timezone: Timezone.AMERICA_NEW_YORK,
          isAllDay: false,
          meetingRoom: "Conference Room A",
          conferenceLink: "https://zoom.us/j/123456789",
          conferenceId: "123-456-789",
          participantEmails: ["team@company.com", "manager@company.com", "dev1@company.com", "dev2@company.com"],
          maxParticipants: 10,
          aiConfidence: 0.92,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id,
          calendarId: workCalendar.id,
        },
        {
          id: `event_project_review_${user.id}`,
          emoji: "📊",
          title: "Q1 Project Review",
          description: "Quarterly review of all ongoing projects and deliverables",
          startTime: new Date("2024-01-25T14:00:00Z"),
          endTime: new Date("2024-01-25T16:00:00Z"),
          timezone: Timezone.AMERICA_NEW_YORK,
          isAllDay: false,
          meetingRoom: "Conference Room B",
          conferenceLink: "https://teams.microsoft.com/l/meetup-join/19%3a...",
          participantEmails: ["ceo@company.com", "cto@company.com", "pm@company.com"],
          documents: ["https://company.com/docs/q1-agenda.pdf", "https://company.com/docs/status-report.xlsx"],
          links: ["https://dashboard.company.com/projects"],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id,
          calendarId: workCalendar.id,
        }
      )
    }

    if (healthCalendar) {
      eventsToCreate.push(
        // Health event
        {
          id: `event_dentist_${user.id}`,
          emoji: "🦷",
          title: "Dentist Appointment",
          description: "Regular dental checkup and cleaning",
          startTime: new Date("2024-01-22T10:00:00Z"),
          endTime: new Date("2024-01-22T11:00:00Z"),
          timezone: Timezone.AMERICA_NEW_YORK,
          isAllDay: false,
          location: "Smile Dental Clinic, 123 Main St",
          aiConfidence: 0.78,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id,
          calendarId: healthCalendar.id,
        }
      )
    }

    if (socialCalendar) {
      eventsToCreate.push(
        // Social event
        {
          id: `event_birthday_party_${user.id}`,
          emoji: "🎂",
          title: "Sarah's Birthday Party",
          description: "Celebrating Sarah's 30th birthday with friends and family",
          startTime: new Date("2024-01-27T18:00:00Z"),
          endTime: new Date("2024-01-27T22:00:00Z"),
          timezone: Timezone.AMERICA_NEW_YORK,
          isAllDay: false,
          location: "Sarah's House, 456 Oak Avenue",
          participantEmails: ["sarah@example.com", "friends@example.com", "family@example.com"],
          maxParticipants: 25,
          aiConfidence: 0.88,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id,
          calendarId: socialCalendar.id,
        }
      )
    }
  }

  // Create all events in batch
  if (eventsToCreate.length > 0) {
    await prisma.event.createMany({
      data: eventsToCreate,
      skipDuplicates: true,
    })
  }

  console.log("✅ Events seeded successfully")
}

export { seedEvents }

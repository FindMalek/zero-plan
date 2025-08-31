import {
  ParticipantRole,
  Prisma,
  PrismaClient,
  RsvpStatus,
  Timezone,
} from "@prisma/client"

async function seedEvents(prisma: PrismaClient) {
  console.log("🌱 Seeding events...")

  const users = await prisma.user.findMany()
  const calendars = await prisma.calendar.findMany()

  // Prepare all event data for batch operations
  const eventsToCreate: Prisma.EventCreateManyInput[] = []
  const conferencesToCreate: Prisma.EventConferenceCreateManyInput[] = []
  const participantsToCreate: Prisma.EventParticipantCreateManyInput[] = []

  for (const user of users) {
    // Find calendars for this user
    const userCalendars = calendars.filter((c) => c.userId === user.id)
    const personalCalendar = userCalendars.find((c) => c.name === "Personal")
    const workCalendar = userCalendars.find((c) => c.name === "Work")
    const healthCalendar = userCalendars.find((c) => c.name === "Health")
    const socialCalendar = userCalendars.find((c) => c.name === "Social")

    if (personalCalendar) {
      const morningRoutineId = `event_morning_routine_${user.id}`
      const groceryShoppingId = `event_grocery_shopping_${user.id}`

      eventsToCreate.push(
        // Personal events
        {
          id: morningRoutineId,
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
          id: groceryShoppingId,
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
      const teamStandupId = `event_team_standup_${user.id}`
      const projectReviewId = `event_project_review_${user.id}`

      eventsToCreate.push(
        // Work events
        {
          id: teamStandupId,
          emoji: "💼",
          title: "Daily Team Standup",
          description:
            "Daily team sync meeting to discuss progress and blockers",
          startTime: new Date("2024-01-15T09:00:00Z"),
          endTime: new Date("2024-01-15T09:30:00Z"),
          timezone: Timezone.AMERICA_NEW_YORK,
          isAllDay: false,
          maxParticipants: 10,
          aiConfidence: 0.92,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id,
          calendarId: workCalendar.id,
        },
        {
          id: projectReviewId,
          emoji: "📊",
          title: "Q1 Project Review",
          description:
            "Quarterly review of all ongoing projects and deliverables",
          startTime: new Date("2024-01-25T14:00:00Z"),
          endTime: new Date("2024-01-25T16:00:00Z"),
          timezone: Timezone.AMERICA_NEW_YORK,
          isAllDay: false,
          links: ["https://dashboard.company.com/projects"],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id,
          calendarId: workCalendar.id,
        }
      )

      // Conference details for work events
      conferencesToCreate.push(
        {
          id: `conf_${teamStandupId}`,
          eventId: teamStandupId,
          meetingRoom: "Conference Room A",
          conferenceLink: "https://zoom.us/j/123456789",
          conferenceId: "123-456-789",
          isRecorded: true,
          maxDuration: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: `conf_${projectReviewId}`,
          eventId: projectReviewId,
          meetingRoom: "Conference Room B",
          conferenceLink: "https://teams.microsoft.com/l/meetup-join/19%3a...",
          isRecorded: true,
          maxDuration: 120,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      )

      // Participants for work events
      participantsToCreate.push(
        // Team Standup participants
        {
          id: `part_${teamStandupId}_1`,
          eventId: teamStandupId,
          email: "team@company.com",
          name: "Team Lead",
          role: ParticipantRole.ORGANIZER,
          rsvpStatus: RsvpStatus.ACCEPTED,
          isOrganizer: true,
          invitedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: `part_${teamStandupId}_2`,
          eventId: teamStandupId,
          email: "manager@company.com",
          name: "Engineering Manager",
          role: ParticipantRole.ATTENDEE,
          rsvpStatus: RsvpStatus.ACCEPTED,
          isOrganizer: false,
          invitedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: `part_${teamStandupId}_3`,
          eventId: teamStandupId,
          email: "dev1@company.com",
          name: "Developer 1",
          role: ParticipantRole.ATTENDEE,
          rsvpStatus: RsvpStatus.PENDING,
          isOrganizer: false,
          invitedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: `part_${teamStandupId}_4`,
          eventId: teamStandupId,
          email: "dev2@company.com",
          name: "Developer 2",
          role: ParticipantRole.ATTENDEE,
          rsvpStatus: RsvpStatus.MAYBE,
          isOrganizer: false,
          invitedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Project Review participants
        {
          id: `part_${projectReviewId}_1`,
          eventId: projectReviewId,
          email: "ceo@company.com",
          name: "CEO",
          role: ParticipantRole.ORGANIZER,
          rsvpStatus: RsvpStatus.ACCEPTED,
          isOrganizer: true,
          invitedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: `part_${projectReviewId}_2`,
          eventId: projectReviewId,
          email: "cto@company.com",
          name: "CTO",
          role: ParticipantRole.PRESENTER,
          rsvpStatus: RsvpStatus.ACCEPTED,
          isOrganizer: false,
          invitedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: `part_${projectReviewId}_3`,
          eventId: projectReviewId,
          email: "pm@company.com",
          name: "Product Manager",
          role: ParticipantRole.ATTENDEE,
          rsvpStatus: RsvpStatus.ACCEPTED,
          isOrganizer: false,
          invitedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
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
      const birthdayPartyId = `event_birthday_party_${user.id}`

      eventsToCreate.push(
        // Social event
        {
          id: birthdayPartyId,
          emoji: "🎂",
          title: "Sarah's Birthday Party",
          description:
            "Celebrating Sarah's 30th birthday with friends and family",
          startTime: new Date("2024-01-27T18:00:00Z"),
          endTime: new Date("2024-01-27T22:00:00Z"),
          timezone: Timezone.AMERICA_NEW_YORK,
          isAllDay: false,
          location: "Sarah's House, 456 Oak Avenue",
          maxParticipants: 25,
          aiConfidence: 0.88,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id,
          calendarId: socialCalendar.id,
        }
      )

      // Participants for social events
      participantsToCreate.push(
        {
          id: `part_${birthdayPartyId}_1`,
          eventId: birthdayPartyId,
          email: "sarah@example.com",
          name: "Sarah",
          role: ParticipantRole.ORGANIZER,
          rsvpStatus: RsvpStatus.ACCEPTED,
          isOrganizer: true,
          notes: "Birthday person!",
          invitedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: `part_${birthdayPartyId}_2`,
          eventId: birthdayPartyId,
          email: "friends@example.com",
          name: "Close Friends",
          role: ParticipantRole.ATTENDEE,
          rsvpStatus: RsvpStatus.ACCEPTED,
          isOrganizer: false,
          invitedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: `part_${birthdayPartyId}_3`,
          eventId: birthdayPartyId,
          email: "family@example.com",
          name: "Family Members",
          role: ParticipantRole.ATTENDEE,
          rsvpStatus: RsvpStatus.MAYBE,
          isOrganizer: false,
          invitedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
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

  // Create all conference details in batch
  if (conferencesToCreate.length > 0) {
    await prisma.eventConference.createMany({
      data: conferencesToCreate,
      skipDuplicates: true,
    })
  }

  // Create all participants in batch
  if (participantsToCreate.length > 0) {
    await prisma.eventParticipant.createMany({
      data: participantsToCreate,
      skipDuplicates: true,
    })
  }

  console.log("✅ Events seeded successfully")
  console.log(`   📅 Created ${eventsToCreate.length} events`)
  console.log(`   🎥 Created ${conferencesToCreate.length} conference details`)
  console.log(`   👥 Created ${participantsToCreate.length} participants`)
}

export { seedEvents }

import {
  ReminderUnit,
  Prisma,
  PrismaClient,
} from "@prisma/client"

async function seedEventReminders(prisma: PrismaClient) {
  console.log("🌱 Seeding event reminders...")

  const events = await prisma.event.findMany()

  // Prepare all reminder data for batch operations
  const remindersToCreate: Prisma.EventReminderCreateManyInput[] = []

  for (const event of events) {
    // Add different reminders based on event type
    if (event.title.includes("Dentist") || event.title.includes("Appointment")) {
      // Medical appointments get more reminders
      remindersToCreate.push(
        {
          id: `reminder_1d_${event.id}`,
          value: 1,
          unit: ReminderUnit.DAYS,
          createdAt: new Date(),
          updatedAt: new Date(),
          eventId: event.id,
        },
        {
          id: `reminder_1h_${event.id}`,
          value: 1,
          unit: ReminderUnit.HOURS,
          createdAt: new Date(),
          updatedAt: new Date(),
          eventId: event.id,
        },
        {
          id: `reminder_15m_${event.id}`,
          value: 15,
          unit: ReminderUnit.MINUTES,
          createdAt: new Date(),
          updatedAt: new Date(),
          eventId: event.id,
        }
      )
    } else if (event.title.includes("Meeting") || event.title.includes("Standup") || event.title.includes("Review")) {
      // Work meetings get standard reminders
      remindersToCreate.push(
        {
          id: `reminder_15m_${event.id}`,
          value: 15,
          unit: ReminderUnit.MINUTES,
          createdAt: new Date(),
          updatedAt: new Date(),
          eventId: event.id,
        },
        {
          id: `reminder_5m_${event.id}`,
          value: 5,
          unit: ReminderUnit.MINUTES,
          createdAt: new Date(),
          updatedAt: new Date(),
          eventId: event.id,
        }
      )
    } else if (event.title.includes("Party") || event.title.includes("Social")) {
      // Social events get gentle reminders
      remindersToCreate.push(
        {
          id: `reminder_2h_${event.id}`,
          value: 2,
          unit: ReminderUnit.HOURS,
          createdAt: new Date(),
          updatedAt: new Date(),
          eventId: event.id,
        },
        {
          id: `reminder_30m_${event.id}`,
          value: 30,
          unit: ReminderUnit.MINUTES,
          createdAt: new Date(),
          updatedAt: new Date(),
          eventId: event.id,
        }
      )
    } else {
      // Default reminders for other events
      remindersToCreate.push(
        {
          id: `reminder_30m_${event.id}`,
          value: 30,
          unit: ReminderUnit.MINUTES,
          createdAt: new Date(),
          updatedAt: new Date(),
          eventId: event.id,
        },
        {
          id: `reminder_10m_${event.id}`,
          value: 10,
          unit: ReminderUnit.MINUTES,
          createdAt: new Date(),
          updatedAt: new Date(),
          eventId: event.id,
        }
      )
    }
  }

  // Create all reminders in batch
  if (remindersToCreate.length > 0) {
    await prisma.eventReminder.createMany({
      data: remindersToCreate,
      skipDuplicates: true,
    })
  }

  console.log("✅ Event reminders seeded successfully")
}

export { seedEventReminders }

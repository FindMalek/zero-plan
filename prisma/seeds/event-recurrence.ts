import {
  RepeatPattern,
  Prisma,
  PrismaClient,
} from "@prisma/client"

async function seedEventRecurrence(prisma: PrismaClient) {
  console.log("🌱 Seeding event recurrence...")

  const events = await prisma.event.findMany()

  // Prepare all recurrence data for batch operations
  const recurrenceToCreate: Prisma.EventRecurrenceCreateManyInput[] = []

  for (const event of events) {
    let pattern: RepeatPattern = RepeatPattern.NONE
    let endDate: Date | undefined

    // Set recurrence patterns based on event type
    if (event.title.includes("Morning Routine") || event.title.includes("Daily") || event.title.includes("Standup")) {
      pattern = RepeatPattern.DAILY
      endDate = new Date("2024-12-31T23:59:59Z") // End of year
    } else if (event.title.includes("Grocery Shopping") || event.title.includes("Weekly")) {
      pattern = RepeatPattern.WEEKLY
      endDate = new Date("2024-06-30T23:59:59Z") // 6 months
    } else if (event.title.includes("Monthly") || event.title.includes("Review")) {
      pattern = RepeatPattern.MONTHLY
      endDate = new Date("2024-12-31T23:59:59Z") // End of year
    } else {
      // No recurrence for one-time events like appointments, parties, etc.
      pattern = RepeatPattern.NONE
    }

    // Only create recurrence for events that actually repeat
    if (pattern !== RepeatPattern.NONE) {
      recurrenceToCreate.push({
        id: `recurrence_${event.id}`,
        pattern,
        endDate,
        customRule: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        eventId: event.id,
      })
    }
  }

  // Create all recurrence rules in batch
  if (recurrenceToCreate.length > 0) {
    await prisma.eventRecurrence.createMany({
      data: recurrenceToCreate,
      skipDuplicates: true,
    })
  }

  console.log("✅ Event recurrence seeded successfully")
}

export { seedEventRecurrence }

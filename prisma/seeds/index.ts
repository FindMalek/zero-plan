import { PrismaClient } from "@prisma/client"

import { seedUsers } from "./users"
import { seedCalendars } from "./calendars"
import { seedEvents } from "./events"
import { seedEventRecurrence } from "./event-recurrence"
import { seedEventReminders } from "./event-reminders"
import { seedInputProcessingSessions } from "./input-processing-sessions"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  try {
    // Seed data in the correct order to respect foreign key constraints
    await seedUsers(prisma)
    await seedCalendars(prisma)
    await seedEvents(prisma)
    await seedEventRecurrence(prisma)
    await seedEventReminders(prisma)
    await seedInputProcessingSessions(prisma)

    console.log("✅ Database seeding completed successfully")
  } catch (error) {
    console.error("❌ Database seeding failed:", error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error("❌ Database seeding failed")
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import {
  Prisma,
  PrismaClient,
} from "@prisma/client"

async function seedCalendars(prisma: PrismaClient) {
  console.log("🌱 Seeding calendars...")

  const users = await prisma.user.findMany()

  // Prepare all calendar data for batch operations
  const calendarsToCreate: Prisma.CalendarCreateManyInput[] = []

  for (const user of users) {
    calendarsToCreate.push(
      // Default personal calendar
      {
        id: `calendar_personal_${user.id}`,
        name: "Personal",
        description: "Personal events and appointments",
        color: "#3B82F6",
        emoji: "📅",
        isDefault: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user.id,
      },
      // Work calendar
      {
        id: `calendar_work_${user.id}`,
        name: "Work",
        description: "Work meetings and professional events",
        color: "#EF4444",
        emoji: "💼",
        isDefault: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user.id,
      },
      // Health calendar
      {
        id: `calendar_health_${user.id}`,
        name: "Health",
        description: "Medical appointments and health activities",
        color: "#10B981",
        emoji: "🏥",
        isDefault: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user.id,
      },
      // Social calendar
      {
        id: `calendar_social_${user.id}`,
        name: "Social",
        description: "Social events and gatherings",
        color: "#8B5CF6",
        emoji: "🎉",
        isDefault: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user.id,
      }
    )
  }

  // Create all calendars in batch
  if (calendarsToCreate.length > 0) {
    await prisma.calendar.createMany({
      data: calendarsToCreate,
      skipDuplicates: true,
    })
  }

  console.log("✅ Calendars seeded successfully")
}

export { seedCalendars }

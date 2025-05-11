import { PrismaClient } from "@prisma/client"

async function seedContainers(prisma: PrismaClient) {
  console.log("🌱 Seeding containers...")

  const users = await prisma.user.findMany()
  const containersData = []

  for (const user of users) {
    // Personal container
    containersData.push({
      id: `container_personal_${user.id}`,
      name: "Personal",
      icon: "🏠",
      description: "Personal accounts and credentials",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
    })

    // Work container
    containersData.push({
      id: `container_work_${user.id}`,
      name: "Work",
      icon: "💼",
      description: "Work-related accounts and credentials",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
    })

    // Finance container
    containersData.push({
      id: `container_finance_${user.id}`,
      name: "Finance",
      icon: "💰",
      description: "Financial accounts and payment information",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
    })
  }

  await prisma.container.createMany({
    data: containersData,
  })

  console.log("✅ Containers seeded successfully")
}

export { seedContainers } 
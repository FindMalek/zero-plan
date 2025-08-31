import { Prisma, PrismaClient } from "@prisma/client"

async function seedUsers(prisma: PrismaClient) {
  console.log("🌱 Seeding users...")

  const usersToCreate: Prisma.UserCreateManyInput[] = [
    {
      id: "user_1",
      name: "John Doe",
      email: "john@example.com",
      emailVerified: true,
      image: "https://avatars.githubusercontent.com/u/123456?v=4",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "user_2",
      name: "Jane Smith",
      email: "jane@example.com",
      emailVerified: true,
      image: "https://avatars.githubusercontent.com/u/789012?v=4",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "user_3",
      name: "Mike Johnson",
      email: "mike@example.com",
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await prisma.user.createMany({
    data: usersToCreate,
    skipDuplicates: true,
  })

  console.log("✅ Users seeded successfully")
}

export { seedUsers }

import { PrismaClient } from "@prisma/client"

async function seedTags(prisma: PrismaClient) {
  console.log("🌱 Seeding tags...")

  const users = await prisma.user.findMany()
  const containers = await prisma.container.findMany()

  const commonTags = [
    { name: "Important", color: "#FF5733" },
    { name: "Personal", color: "#33FF57" },
    { name: "Work", color: "#3357FF" },
    { name: "Finance", color: "#F3FF33" },
    { name: "Social", color: "#FF33F3" },
  ]

  // Prepare user tags data
  const userTagsData = []
  for (const user of users) {
    for (const tag of commonTags) {
      userTagsData.push({
        id: `tag_${tag.name.toLowerCase()}_${user.id}`,
        name: tag.name,
        color: tag.color,
        userId: user.id,
      })
    }
  }

  // Prepare container-specific tags data
  const containerTagsData = []
  for (const container of containers) {
    if (container.name === "Work") {
      containerTagsData.push({
        id: `tag_project_${container.id}`,
        name: "Projects",
        color: "#8833FF",
        userId: container.userId,
        containerId: container.id,
      })
    } else if (container.name === "Finance") {
      containerTagsData.push({
        id: `tag_banking_${container.id}`,
        name: "Banking",
        color: "#33FFEC",
        userId: container.userId,
        containerId: container.id,
      })
    }
  }

  // Bulk create all tags
  const allTagsData = [...userTagsData, ...containerTagsData]
  await prisma.tag.createMany({
    data: allTagsData,
  })

  console.log("✅ Tags seeded successfully")
}

export { seedTags } 
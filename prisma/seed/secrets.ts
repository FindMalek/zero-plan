import { PrismaClient, SecretType, SecretStatus } from "@prisma/client"

async function seedSecrets(prisma: PrismaClient) {
  console.log("🌱 Seeding secrets...")

  const users = await prisma.user.findMany()
  const platforms = await prisma.platform.findMany()
  const containers = await prisma.container.findMany()
  const secretsData = []

  // Get the platform IDs
  const awsPlatform = platforms.find((p) => p.name === "AWS")
  const githubPlatform = platforms.find((p) => p.name === "GitHub")

  // Ensure platforms are found
  if (!awsPlatform || !githubPlatform) {
    console.error("❌ Required platforms not found")
    return
  }

  for (const user of users) {
    // Find the work container for each user
    const workContainer = containers.find(
      (c) => c.userId === user.id && c.name === "Work"
    )

    if (workContainer) {
      // AWS API key
      secretsData.push({
        id: `secret_aws_${user.id}`,
        name: "AWS API Key",
        value: "AKIAIOSFODNN7EXAMPLE",
        description: "API key for AWS services",
        type: SecretType.API_KEY,
        status: SecretStatus.ACTIVE,
        updatedAt: new Date(),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        userId: user.id,
        containerId: workContainer.id,
        platformId: awsPlatform.id,
      })

      // GitHub PAT
      secretsData.push({
        id: `secret_github_${user.id}`,
        name: "GitHub Personal Access Token",
        value: "ghp_examplePersonalAccessTokenValue123456789",
        description: "PAT for GitHub API access",
        type: SecretType.API_KEY,
        status: SecretStatus.ACTIVE,
        updatedAt: new Date(),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days from now
        userId: user.id,
        containerId: workContainer.id,
        platformId: githubPlatform.id,
      })

      // Database connection string
      secretsData.push({
        id: `secret_db_${user.id}`,
        name: "Development Database URL",
        value: "postgresql://user:password@localhost:5432/mydb",
        description: "Connection string for local development database",
        type: SecretType.DATABASE_URL,
        status: SecretStatus.ACTIVE,
        updatedAt: new Date(),
        createdAt: new Date(),
        userId: user.id,
        containerId: workContainer.id,
        platformId: awsPlatform.id,
      })
    }
  }

  await prisma.secret.createMany({
    data: secretsData,
  })

  console.log("✅ Secrets seeded successfully")
}

export { seedSecrets } 
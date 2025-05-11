import { database as prisma } from "@/database/client"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

import { env } from "@/env"

import { saltAndHashPassword, verifyPassword } from "@/lib/auth/password"

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: saltAndHashPassword,
      verify: verifyPassword,
    },
  },
})

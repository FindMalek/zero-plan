import { createAuthClient } from "better-auth/react"

import { env } from "@/env"

export const { signIn, signOut, useSession, signUp } = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
})

import { createOpenAI } from "@ai-sdk/openai"

import { env } from "@/env"

const client = createOpenAI({
  baseURL: "https://api.voidai.app/v1/",
  apiKey: env.VOIDAI_API_KEY,
})

export { client }

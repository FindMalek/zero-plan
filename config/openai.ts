import { createOpenAI } from "@ai-sdk/openai"

import { env } from "@/env"

const client = createOpenAI({
  baseURL: env.OPENAI_URL,
  apiKey: env.OPENAI_API_KEY,
})

const MODEL_NAME = "gemini-2.5-flash"
const PROVIDER_NAME = "al"
const aiModel = client.chat(MODEL_NAME)

export { client, aiModel, MODEL_NAME, PROVIDER_NAME }

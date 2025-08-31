import { z } from "zod"

import { createEventDto } from "../event"
import { timezoneSchema } from "../utils"

// =============================================================================
// AI EVENT ENTITY SCHEMAS
// =============================================================================

// AI Event Schema - extends existing createEventDto
export const aiEventSchema = createEventDto
  .omit({ calendarId: true }) // We'll handle calendar separately
  .extend({
    startTime: z.string().describe("ISO 8601 start date/time for the event"),
    endTime: z
      .string()
      .optional()
      .describe("ISO 8601 end date/time for the event"),
    timezone: timezoneSchema
      .default("UTC")
      .describe(
        "Timezone for the event - must be one of: UTC, AMERICA_NEW_YORK, AMERICA_CHICAGO, AMERICA_DENVER, AMERICA_LOS_ANGELES, EUROPE_LONDON, EUROPE_PARIS, EUROPE_BERLIN, ASIA_TOKYO, ASIA_SINGAPORE, ASIA_DUBAI, AUSTRALIA_SYDNEY"
      ),
    confidence: z
      .number()
      .min(0)
      .max(1)
      .describe("AI confidence score for this extraction (0.0-1.0)"),
  })
  .refine((data) => {
    // Ensure title includes emoji and descriptive text
    const hasEmoji =
      /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
        data.title
      )
    return hasEmoji
  }, "Title must include an appropriate emoji")
  .refine((data) => {
    // Ensure description is rich and detailed, not generic
    const isGeneric =
      data.description?.includes("AI-generated") ||
      data.description === "" ||
      (data.description && data.description.length < 20)
    return !isGeneric
  }, "Description must be detailed and contextual, never generic")

export type AiEventSchema = z.infer<typeof aiEventSchema>

// AI Event Generation Schema
export const aiEventGenerationSchema = z.object({
  events: z.array(aiEventSchema).min(1, "Must generate at least one event"),
  processingNotes: z
    .string()
    .optional()
    .describe("Any notes about the processing or interpretation"),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Overall confidence in the extraction (0.0-1.0)"),
  contextUsed: z
    .array(z.string())
    .optional()
    .describe(
      "List of context clues used for generation (time, location, etc.)"
    ),
})

export type AiEventGenerationSchema = z.infer<typeof aiEventGenerationSchema>

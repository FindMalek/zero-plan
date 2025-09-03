import { z } from "zod"

import { eventRo } from "../event"
import { processingSessionRo } from "../processing"

export const generateEventsRo = z.object({
  success: z.boolean(),
  events: z
    .array(
      eventRo.extend({
        confidence: z.number(),
      })
    )
    .optional(),
  processingSession: z
    .object({
      id: z.string(),
      confidence: z.number(),
      processingTimeMs: z.number(),
      tokensUsed: z.number().optional(),
    })
    .optional(),
  error: z.string().optional(),
})

export type GenerateEventsRo = z.infer<typeof generateEventsRo>

export const progressRo = z.object({
  progress: z.number(),
  stage: z.string(),
  status: z.string(),
})

export type ProgressRo = z.infer<typeof progressRo>

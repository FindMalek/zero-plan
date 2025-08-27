import { z } from "zod"

// Processing Status Enum
export const processingStatusEnum = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  RETRY: "RETRY",
} as const

export const processingStatusSchema = z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "RETRY"])
export type ProcessingStatusInfer = z.infer<typeof processingStatusSchema>

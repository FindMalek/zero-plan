import { database } from "@/prisma/client"

/**
 * Helper function to update progress during AI tool execution
 * Provides real-time feedback to users about the current processing stage
 */
export async function updateProgress(
  processingSessionId: string,
  progress: number,
  stage: string
): Promise<void> {
  try {
    await database.inputProcessingSession.update({
      where: { id: processingSessionId },
      data: {
        processedOutput: { progress, stage },
      },
    })
  } catch (error) {
    // Silently fail to avoid breaking the main flow
    console.error("Failed to update progress:", error)
  }
}

/**
 * Progress stages for different tool executions
 * Maps tool execution phases to user-friendly messages
 */
export const PROGRESS_STAGES = {
  // Analysis phase (15-35%)
  ANALYZING_INTENT: {
    progress: 20,
    stage: "🧠 Analyzing your request and understanding intent..."
  },
  EXTRACTING_CONTEXT: {
    progress: 25,
    stage: "🔍 Extracting locations, timing, and context clues..."
  },
  PLANNING_STRUCTURE: {
    progress: 35,
    stage: "📋 Planning optimal event structure and flow..."
  },
  
  // Generation phase (40-75%)
  GETTING_TIME_INFO: {
    progress: 40,
    stage: "⏰ Getting current time and scheduling context..."
  },
  SELECTING_EMOJIS: {
    progress: 50,
    stage: "😊 Selecting perfect emojis for your events..."
  },
  CALCULATING_TIMING: {
    progress: 55,
    stage: "⌚ Calculating optimal timing and durations..."
  },
  PLANNING_TRAVEL: {
    progress: 60,
    stage: "🚗 Planning travel routes and logistics..."
  },
  GENERATING_DESCRIPTIONS: {
    progress: 70,
    stage: "✍️ Crafting detailed event descriptions with AI..."
  },
  
  // Finalization phase (80-95%)
  BUILDING_SEQUENCE: {
    progress: 80,
    stage: "🔗 Building comprehensive event sequences..."
  },
  FINALIZING_EVENTS: {
    progress: 90,
    stage: "🎯 Finalizing events with perfect details..."
  },
  COMPLETING: {
    progress: 95,
    stage: "✨ Completing your personalized event plan..."
  }
} as const

/**
 * Progress context that can be passed between tools
 * Allows tools to update progress during execution
 */
export interface ProgressContext {
  processingSessionId?: string
  updateProgress?: (progress: number, stage: string) => Promise<void>
}

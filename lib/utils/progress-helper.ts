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
  // Initialization (10-20%)
  INITIALIZING: {
    progress: 10,
    stage: "🚀 Initializing AI event generation...",
  },

  // Analysis phase (20-40%)
  ANALYZING_INTENT: {
    progress: 20,
    stage: "🧠 Analyzing your request and understanding intent...",
  },
  GETTING_TIME_INFO: {
    progress: 30,
    stage: "⏰ Getting current time and scheduling context...",
  },
  PLANNING_STRUCTURE: {
    progress: 40,
    stage: "📋 Planning optimal event structure and flow...",
  },

  // Generation phase (50-80%)
  SELECTING_EMOJIS: {
    progress: 50,
    stage: "😊 Selecting perfect emojis for your events...",
  },
  CALCULATING_TIMING: {
    progress: 55,
    stage: "⌚ Calculating optimal timing and durations...",
  },
  PLANNING_TRAVEL: {
    progress: 60,
    stage: "🚗 Planning travel routes and logistics...",
  },
  GENERATING_DESCRIPTIONS: {
    progress: 70,
    stage: "✍️ Crafting detailed event descriptions with AI...",
  },
  BUILDING_SEQUENCE: {
    progress: 80,
    stage: "🔗 Building comprehensive event sequences...",
  },

  // Finalization phase (90-100%)
  FINALIZING_EVENTS: {
    progress: 90,
    stage: "🎯 Finalizing events with perfect details...",
  },
  COMPLETING: {
    progress: 95,
    stage: "✨ Completing your personalized event plan...",
  },
  COMPLETED: {
    progress: 100,
    stage: "✅ Events generated successfully!",
  },
  FAILED: {
    progress: 0,
    stage: "❌ Event generation failed.",
  },
} as const

/**
 * Maps tool names to their corresponding progress stages
 */
export const TOOL_PROGRESS_MAP = {
  analyzeUserIntent: PROGRESS_STAGES.ANALYZING_INTENT,
  getCurrentTimeInfo: PROGRESS_STAGES.GETTING_TIME_INFO,
  planEventStructure: PROGRESS_STAGES.PLANNING_STRUCTURE,
  selectEventEmoji: PROGRESS_STAGES.SELECTING_EMOJIS,
  calculateEventTiming: PROGRESS_STAGES.CALCULATING_TIMING,
  planTravelEvents: PROGRESS_STAGES.PLANNING_TRAVEL,
  generateEventDescription: PROGRESS_STAGES.GENERATING_DESCRIPTIONS,
  generateEventSequence: PROGRESS_STAGES.BUILDING_SEQUENCE,
  formatTravelEvent: PROGRESS_STAGES.PLANNING_TRAVEL,
  analyzeEventComplexity: PROGRESS_STAGES.ANALYZING_INTENT,
  extractLocationContext: PROGRESS_STAGES.ANALYZING_INTENT,
} as const

/**
 * Progress context that can be passed between tools
 * Allows tools to update progress during execution
 */
export interface ProgressContext {
  processingSessionId?: string
  updateProgress?: (progress: number, stage: string) => Promise<void>
}

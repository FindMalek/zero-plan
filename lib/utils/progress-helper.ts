import { database } from "@/prisma/client"

/**
 * Helper function to update progress during AI tool execution
 * Provides real-time feedback to users about the current processing stage
 * Enhanced for streaming with better error handling and validation
 */
export async function updateProgress(
  processingSessionId: string,
  progress: number,
  stage: string
): Promise<void> {
  try {
    // Validate inputs
    if (!processingSessionId) {
      console.warn("Progress update called without processing session ID")
      return
    }

    // Ensure progress is within valid range
    const validProgress = Math.max(0, Math.min(100, progress))

    // Add timestamp for better tracking
    const timestamp = new Date().toISOString()

    await database.inputProcessingSession.update({
      where: { id: processingSessionId },
      data: {
        processedOutput: {
          progress: validProgress,
          stage,
          timestamp,
          lastUpdated: timestamp,
        },
      },
    })

    // Log for development
    if (process.env.NODE_ENV === "development") {
      console.log(`📊 Progress updated: ${validProgress}% - ${stage}`)
    }
  } catch (error) {
    // Enhanced error logging for debugging
    console.error("Failed to update progress:", {
      processingSessionId,
      progress,
      stage,
      error: error instanceof Error ? error.message : error,
    })
  }
}

// Global progress tracker to ensure sequential updates
const progressTracker = new Map<
  string,
  { progress: number; lastUpdate: number }
>()

/**
 * Enhanced progress update with automatic stage detection based on tool calls
 * Now includes progress sequence management to prevent backwards movement
 */
export async function updateProgressFromTool(
  processingSessionId: string,
  toolName: string,
  additionalContext?: string
): Promise<void> {
  const progressStage =
    TOOL_PROGRESS_MAP[toolName as keyof typeof TOOL_PROGRESS_MAP]

  if (progressStage) {
    // Get current progress tracker for this session
    const currentTracker = progressTracker.get(processingSessionId) || {
      progress: 0,
      lastUpdate: 0,
    }

    // Only update if this progress is higher than current (prevent backwards movement)
    if (progressStage.progress > currentTracker.progress) {
      const enhancedStage = additionalContext
        ? `${progressStage.stage} ${additionalContext}`
        : progressStage.stage

      await updateProgress(
        processingSessionId,
        progressStage.progress,
        enhancedStage
      )

      // Update tracker
      progressTracker.set(processingSessionId, {
        progress: progressStage.progress,
        lastUpdate: Date.now(),
      })
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `⚠️ Skipping backwards progress: ${progressStage.progress}% (current: ${currentTracker.progress}%) for tool: ${toolName}`
        )
      }
    }
  } else {
    console.warn(`Unknown tool for progress tracking: ${toolName}`)
  }
}

/**
 * Clean up progress tracker when session completes
 */
export function cleanupProgressTracker(processingSessionId: string): void {
  progressTracker.delete(processingSessionId)
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

  // Finalization phase (85-100%)
  GENERATING_STRUCTURE: {
    progress: 85,
    stage: "📝 Generating structured event data...",
  },
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
 * Progress stages for the new chained AI approach
 */
export const CHAINED_PROGRESS = {
  TOOL_PHASE: "Tool execution and planning phase",
  STRUCTURE_PHASE: "Structured output generation phase",
  FINALIZATION_PHASE: "Database storage and completion phase",
} as const

/**
 * Progress context that can be passed between tools
 * Allows tools to update progress during execution
 */
export interface ProgressContext {
  processingSessionId?: string
  updateProgress?: (progress: number, stage: string) => Promise<void>
}

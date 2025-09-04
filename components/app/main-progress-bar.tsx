"use client"

import { useEffect } from "react"
import { useStreamingProgress } from "@/orpc/hooks"

import { Progress } from "@/components/ui/progress"

interface MainProgressBarProps {
  isVisible: boolean
  processingSessionId?: string
  onProcessingComplete?: () => void
}

export function MainProgressBar({
  isVisible,
  processingSessionId,
  onProcessingComplete,
}: MainProgressBarProps) {
  const {
    data: progressData,
    isLoading,
    error,
  } = useStreamingProgress(processingSessionId || null, isVisible)

  // Watch for completion and trigger callback
  useEffect(() => {
    if (progressData?.status === "COMPLETED" && onProcessingComplete) {
      onProcessingComplete()
    }
  }, [progressData?.status, onProcessingComplete])

  // Optional debug logging for development
  // Removed to reduce console noise

  if (!isVisible) return null

  // Enhanced progress handling with better defaults and error states
  const progress = progressData?.progress ?? 15
  const stage =
    progressData?.stage ??
    (isLoading ? "Connecting to AI system..." : "Initializing your request...")
  const status = progressData?.status ?? "PROCESSING"

  // Handle different states
  const getProgressBarColor = () => {
    if (error) return "bg-red-500"
    if (status === "COMPLETED") return "bg-green-500"
    if (status === "FAILED") return "bg-red-500"
    return "bg-blue-500"
  }

  const getStageColor = () => {
    if (error) return "text-red-600 dark:text-red-400"
    if (status === "COMPLETED") return "text-green-600 dark:text-green-400"
    if (status === "FAILED") return "text-red-600 dark:text-red-400"
    return "text-slate-600 dark:text-slate-400"
  }

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${getStageColor()}`}>
          {error ? "❌ Connection error - retrying..." : stage}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-500">
            {progress}%
          </span>
          {isLoading && (
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          )}
        </div>
      </div>
      <Progress
        value={progress}
        className="h-2 bg-slate-100 dark:bg-slate-700"
      />
      <style jsx>{`
        .progress-bar {
          background-color: ${getProgressBarColor()};
        }
      `}</style>
    </div>
  )
}

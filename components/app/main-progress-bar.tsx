"use client"

import { useProgress } from "@/orpc/hooks"

import { env } from "@/env"

import { Progress } from "@/components/ui/progress"

interface MainProgressBarProps {
  isVisible: boolean
  processingSessionId?: string
}

export function MainProgressBar({
  isVisible,
  processingSessionId,
}: MainProgressBarProps) {
  const {
    data: progressData,
    isLoading,
    error,
  } = useProgress(processingSessionId || null, isVisible)

  // Debug logging (only in development)
  if (env.NODE_ENV === "development") {
    console.log("🔄 Progress Bar Debug:", {
      isVisible,
      processingSessionId,
      progressData,
      isLoading,
      error,
    })
  }

  if (!isVisible) return null

  const progress = progressData?.progress || 15
  const stage = progressData?.stage || "Initializing your request..."

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {stage}
        </p>
        <span className="text-xs text-slate-500 dark:text-slate-500">
          {progress}%
        </span>
      </div>
      <Progress
        value={progress}
        className="h-2 bg-slate-100 dark:bg-slate-700"
      />
    </div>
  )
}

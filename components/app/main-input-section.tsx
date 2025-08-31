"use client"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface MainInputSectionProps {
  eventDetails: string
  setEventDetails: (value: string) => void
  onSend: () => void
  isPending: boolean
}

export function MainInputSection({
  eventDetails,
  setEventDetails,
  onSend,
  isPending,
}: MainInputSectionProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!isPending && eventDetails.trim()) {
        onSend()
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          value={eventDetails}
          onChange={(e) => setEventDetails(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type or paste your event details here... (e.g., 'Coffee meeting with John tomorrow at 3pm') - Press Enter to submit"
          disabled={isPending}
          className="min-h-[120px] resize-none rounded-xl border-slate-200 bg-white pr-12 text-base text-slate-900 shadow-sm transition-all duration-200 focus:border-blue-400 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onSend}
                disabled={isPending || !eventDetails.trim()}
                className="absolute bottom-3 right-3 h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-0 text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-900 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : eventDetails.trim() ? (
                  <Icons.send className="h-4 w-4" />
                ) : (
                  <Icons.microphone className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {eventDetails.trim()
                ? "Process with AI"
                : "Voice input (coming soon)"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

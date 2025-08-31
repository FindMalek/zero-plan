"use client"

import { useState } from "react"
import { EventSimpleRo } from "@/schemas"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface MainEventCardProps {
  event: EventSimpleRo
}

export function MainEventCard({ event }: MainEventCardProps) {
  const [copied, setCopied] = useState(false)

  const formatEventForCopy = () => {
    const date = event.startTime.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    const startTime = event.startTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
    const endTime = event.endTime
      ? event.endTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      : null

    let copyText = `${event.title} on ${date} at ${startTime}${endTime ? ` - ${endTime}` : ""}`

    if (event.description) {
      copyText += `\n\n${event.description}`
    }

    return copyText
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatEventForCopy())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="flex-1 text-lg font-medium text-slate-900 dark:text-slate-100">
          {event.title}
        </h3>
        <div className="ml-4 flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
            {`${event.startTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}${
              event.endTime
                ? " - " +
                  event.endTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""
            }`}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {copied ? (
                    <Icons.check className="h-4 w-4" />
                  ) : (
                    <Icons.copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied ? "Copied!" : "Copy event details"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Event details */}
      {(event.description || event.location) && (
        <div className="space-y-2">
          {event.location && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              📍 {event.location}
            </p>
          )}
          {event.description && (
            <div
              className="text-sm text-slate-700 dark:text-slate-300"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          )}
        </div>
      )}
    </div>
  )
}

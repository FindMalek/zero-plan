"use client"

import { EventSimpleRo } from "@/schemas"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

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
  isLoading?: boolean
}

export function MainEventCard({
  event,
  isLoading = false,
}: MainEventCardProps) {
  const { isCopied, copy } = useCopyToClipboard()

  const handleCopy = async () => {
    try {
      await copy(event.title)
    } catch (error) {
      console.error("Copy failed:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="animate-pulse">
          <div className="mb-3 flex items-start justify-between">
            <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
      </div>
    )
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
                  {isCopied ? (
                    <Icons.check className="h-4 w-4" />
                  ) : (
                    <Icons.copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isCopied ? "Copied event title!" : "Copy event title"}
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
              dangerouslySetInnerHTML={{
                __html: event.description
                  .replace(
                    new RegExp(
                      `<p><strong>${event.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</strong></p>`,
                      "gi"
                    ),
                    ""
                  )
                  .replace(
                    new RegExp(
                      event.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                      "gi"
                    ),
                    ""
                  )
                  .trim(),
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

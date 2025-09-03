import { EventSimpleRo } from "@/schemas"

import { MainEventCard } from "./main-event-card"
import { MainProgressBar } from "./main-progress-bar"

interface MainEventsSectionProps {
  events: EventSimpleRo[]
  isLoading?: boolean
  showLoadingCards?: number
  processingSessionId?: string
}

export function MainEventsSection({
  events,
  isLoading = false,
  showLoadingCards = 2,
  processingSessionId,
}: MainEventsSectionProps) {
  const shouldShowSection = events.length > 0 || isLoading

  if (!shouldShowSection) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        Your Events
      </h2>

      <MainProgressBar
        isVisible={isLoading}
        processingSessionId={processingSessionId}
      />

      <div className="space-y-3">
        {events.map((event) => (
          <MainEventCard key={event.id} event={event} />
        ))}
        {isLoading &&
          Array.from({ length: showLoadingCards }, (_, index) => (
            <MainEventCard
              key={`loading-${index}`}
              event={{} as EventSimpleRo}
              isLoading={true}
            />
          ))}
      </div>
    </div>
  )
}

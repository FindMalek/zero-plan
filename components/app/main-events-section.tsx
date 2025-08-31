import { EventSimpleRo } from "@/schemas"

import { MainEventCard } from "./main-event-card"

interface MainEventsSectionProps {
  events: EventSimpleRo[]
}

export function MainEventsSection({ events }: MainEventsSectionProps) {
  if (events.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        Your Events
      </h2>
      <div className="space-y-3">
        {events.map((event) => (
          <MainEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

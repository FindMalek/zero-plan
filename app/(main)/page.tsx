"use client"

import { useState } from "react"
import { useInitiateEventGeneration } from "@/orpc/hooks"
import { EventSimpleRo } from "@/schemas"

import { MainBackground } from "@/components/app/main-background"
import { MainEventsSection } from "@/components/app/main-events-section"
import { MainHeader } from "@/components/app/main-header"
import { MainInputSection } from "@/components/app/main-input-section"

export default function MainPage() {
  const initiateEvents = useInitiateEventGeneration()
  const [events, setEvents] = useState<EventSimpleRo[]>([])
  const [processingSessionId, setProcessingSessionId] = useState<
    string | undefined
  >()
  const [eventDetails, setEventDetails] = useState(
    "I have a doctor appoitement eye checkup in Ksar hellal (i live there) at 4pm and its just 15 mins go and back using the car, tomorrow i need to have a coffee with my friend Ayoub Fanter in sayeda i will be using the scooter its just 15 mins transportation to his home to pick him up and then go to a café and then after the coffee i gotta put him home again and return to my house, and the next week on monday i have to work for 4 hours in Zero Plan project at home from 4pm, but before that i need to drink my coffee"
  )

  const handleSend = async () => {
    if (!eventDetails.trim()) return

    // Clear previous state
    setEvents([])
    setProcessingSessionId(undefined)

    try {
      // Step 1: Initiate event generation and get session ID immediately
      const result = await initiateEvents.mutateAsync({
        userInput: eventDetails.trim(),
      })

      if (result.success && result.processingSessionId) {
        console.log(
          "🚀 Event generation initiated, session ID:",
          result.processingSessionId
        )
        setProcessingSessionId(result.processingSessionId)
        setEventDetails("")

        // Note: The actual AI processing happens in the background
        // Progress will be tracked via the streaming progress hook
        // Events will be available when the processing completes
      } else {
        console.error("Failed to initiate event generation:", result.error)
      }
    } catch (error) {
      console.error("Error initiating event generation:", error)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4 py-12 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <MainBackground />

      <div className="relative z-10 mx-auto w-full max-w-2xl space-y-8">
        <MainHeader />

        <MainInputSection
          eventDetails={eventDetails}
          setEventDetails={setEventDetails}
          onSend={handleSend}
          isPending={initiateEvents.isPending}
        />

        <MainEventsSection
          events={events}
          isLoading={initiateEvents.isPending || !!processingSessionId}
          showLoadingCards={3}
          processingSessionId={processingSessionId}
        />
      </div>
    </div>
  )
}

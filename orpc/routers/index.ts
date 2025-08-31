import { aiRouter } from "./ai"
import { eventRouter } from "./event"

export const appRouter = {
  events: eventRouter,
  ai: aiRouter,
}

export type AppRouter = typeof appRouter

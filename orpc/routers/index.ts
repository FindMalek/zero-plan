import { eventRouter } from "./event"
import { userRouter } from "./user"

export const appRouter = {
  users: userRouter,
  events: eventRouter,
}

export type AppRouter = typeof appRouter

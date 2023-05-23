import { createTRPCRouter } from "@/server/api/trpc";
import { signUpRouter } from "@/server/api/routers/signup";
import { todoRouter } from "@/server/api/routers/todo";
import { listboardsRouter } from "@/server/api/routers/listboards";
import { daylogRouter } from "@/server/api/routers/daylog";
import { dateRecordRouter } from "@/server/api/routers/dateRecord";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  signup: signUpRouter,
  todo: todoRouter,
  listboards: listboardsRouter,
  daylog: daylogRouter,
  daterecord: dateRecordRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

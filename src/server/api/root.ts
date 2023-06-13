import { createTRPCRouter } from "@/server/api/trpc";
import { signUpRouter } from "@/server/api/routers/signupRouter";
import { todoRouter } from "@/server/api/routers/todoRouter";
import { listboardsRouter } from "@/server/api/routers/listboardsRouter";
import { daylogRouter } from "@/server/api/routers/daylogRouter";
import { dateRecordRouter } from "@/server/api/routers/dateRecordRouter";
import { revenueRouter } from "@/server/api/routers/revenueRouter";
import { userRouter } from "@/server/api/routers/userRouter";
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
  revenue: revenueRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

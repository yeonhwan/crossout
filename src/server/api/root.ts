import { createTRPCRouter } from "@/server/api/trpc";
import { signUpRouter } from "@/server/api/routers/signup";
import { todoRouter } from "@/server/api/routers/todo";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  signup: signUpRouter,
  todo: todoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const todoRouter = createTRPCRouter({
  createTodo: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        userId: z.string().min(1),
        completed: z.optional(z.boolean()),
        urgency: z.string().min(1),
        listBoardId: z.optional(z.string().min(1)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;

      // CASE 1. USER HAS NOT SIGNED IN
      if (!session) {
        throw new TRPCError({ message: "BAD_REQUEST", code: "BAD_REQUEST" });
      }

      // CASE 2. TOKEN EXPIRED
      const { expires } = session;
      const now = new Date().getTime();
      const token_expires = new Date(expires).getTime();
      if (token_expires - now < 0) {
        throw new TRPCError({ message: "TOKEN_EXPIRED", code: "FORBIDDEN" });
      }

      // CASE 3. USER DOES NOT EXISTS or MATCH
      const { id } = session.user;
      const user = await ctx.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new TRPCError({ message: "BAD_REQUEST", code: "BAD_REQUEST" });
      }

      console.log(input);
    }),
});

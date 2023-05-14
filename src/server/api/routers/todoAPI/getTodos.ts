import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// verify
import tokenVerify from "@/server/api/routers/auth/tokenVerify";

const getTodos = protectedProcedure
  .input(
    z.object({
      dateObject: z.object({
        year: z.number(),
        month: z.number(),
        date: z.number(),
      }),
    })
  )
  .query(async ({ ctx, input }) => {
    const session = ctx.session;

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    // CASE 3 + Query. USER DOES NOT EXISTS or MATCH
    // Querying Todos with a given date
    // 1. Find User with the given userId
    // 2. Find Dayrecord with the given dateObj
    // 3. Query all todos in related Dayrecord

    const { id: userId } = session.user;
    const { year, month, date } = input.dateObject;
    console.log(year, month, date);

    try {
      const dateRecordsWithTodos = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          dateRecords: {
            where: { year, month, date },
            select: { todos: true, year: true, month: true, date: true },
          },
        },
      });
      const data = dateRecordsWithTodos.dateRecords[0];
      return { data };
    } catch (err) {
      throw new TRPCError({
        message: "SERVER_ERROR",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });

export default getTodos;

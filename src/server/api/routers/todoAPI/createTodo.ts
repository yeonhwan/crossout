import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type Todo } from "@prisma/client";

// auth
import tokenVerify from "@/server/api/routers/auth/tokenVerify";

const Urgency = ["urgent", "important", "trivial"] as const;

const createTodo = protectedProcedure
  .input(
    z.object({
      content: z.string().min(1),
      urgency: z.enum(Urgency),
      listBoardId: z.optional(z.number()),
      dateObj: z.object({
        year: z.number(),
        month: z.number(),
        date: z.number(),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const session = ctx.session;

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    // CASE 3. USER DOES NOT EXISTS or MATCH
    const { id: userId } = session.user;
    const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new TRPCError({ message: "BAD_REQUEST", code: "BAD_REQUEST" });
    }

    // Creating a New Todo
    // 1. Find Dayrecord, if not create new one
    // 2. (optional) Find Listboards
    // 3. Create new Todo (relate to DayRecord, User, Listboard)

    try {
      const { content, dateObj, urgency, listBoardId } = input;
      let dateRecord = await ctx.prisma.dateRecord.findUnique({
        where: { year_month_date: dateObj },
      });
      console.log(dateRecord, "dateRecord found?");
      if (!dateRecord) {
        dateRecord = await ctx.prisma.dateRecord.create({
          data: {
            userId,
            year: dateObj.year,
            month: dateObj.month,
            date: dateObj.date,
          },
        });
      }
      const { id: dateRecordId } = dateRecord;
      console.log(dateRecord, "dateRecord created?");

      if (!listBoardId) {
        const newTodo: Todo = await ctx.prisma.todo.create({
          data: { userId, dateRecordId, content, urgency },
        });
        return { data: newTodo };
      } else {
        const newTodo: Todo = await ctx.prisma.todo.create({
          data: { userId, dateRecordId, content, urgency, listBoardId },
        });
        return { data: newTodo };
      }
    } catch (err) {
      throw new TRPCError({
        message: "SERVER_ERROR",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });

export default createTodo;

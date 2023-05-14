import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { type Todo } from "@prisma/client";

const Urgency = ["urgent", "important", "trivial"] as const;

export const todoRouter = createTRPCRouter({
  getTodos: protectedProcedure
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
    }),

  createTodo: protectedProcedure
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
    }),
});

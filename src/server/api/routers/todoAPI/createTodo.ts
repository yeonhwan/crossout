import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { type DateRecord, type Prisma, type Todo } from "@prisma/client";

const Urgency = ["urgent", "important", "trivial"] as const;

const createTodo = protectedProcedure
  .input(
    z.object({
      content: z.string().min(1).max(45),
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
    const { id: userId } = session.user;
    const { year, month, date } = input.dateObj;
    const { content, dateObj, urgency, listBoardId } = input;

    // Creating a New Todo
    // 1. Find Dayrecord, if not create new one
    // 2. (optional) Find Listboards
    // 3. Create new Todo (relate to DayRecord, User, Listboard)

    const createTodo = async (
      dateRecordId: number,
      todoIndex: Prisma.JsonValue
    ) => {
      if (!listBoardId) {
        const newTodo: Todo = await ctx.prisma.todo.create({
          data: { userId, dateRecordId, content, urgency },
        });
        const newIndex = todoIndex
          ? [...(todoIndex as Prisma.JsonArray), newTodo.id]
          : [newTodo.id];
        await ctx.prisma.dateRecord.update({
          where: { id: dateRecordId },
          data: { todoIndex: newIndex },
        });

        return {
          data: {
            content: newTodo.content,
            id: newTodo.id,
            dateRecordId: newTodo.dateRecordId,
            message: "Successfuly Created",
          },
        };
      } else {
        const newTodo: Todo = await ctx.prisma.todo.create({
          data: { userId, dateRecordId, content, urgency, listBoardId },
        });
        const newIndex = todoIndex
          ? [...(todoIndex as Prisma.JsonArray), newTodo.id]
          : [newTodo.id];
        await ctx.prisma.dateRecord.update({
          where: { id: dateRecordId },
          data: { todoIndex: newIndex },
        });
        return {
          data: {
            content: newTodo.content,
            id: newTodo.id,
            dateRecordId: newTodo.dateRecordId,
            message: "Successfuly Created",
          },
        };
      }
    };

    try {
      const userWithDateRecord = await ctx.prisma.user.findUnique({
        where: { id: userId },
        include: {
          dateRecords: {
            where: {
              year,
              month,
              date,
            },
          },
        },
      });

      if (!userWithDateRecord) {
        throw new TRPCError({ message: "BAD_REQUEST", code: "BAD_REQUEST" });
      }

      const dateRecord = userWithDateRecord.dateRecords[0] as DateRecord;

      if (dateRecord) {
        const { id: dateRecordId, todoIndex } = dateRecord;
        return createTodo(dateRecordId, todoIndex);
      } else {
        const newDateRecord = await ctx.prisma.dateRecord.create({
          data: {
            userId,
            year: dateObj.year,
            month: dateObj.month,
            date: dateObj.date,
          },
        });
        const { id: dateRecordId, todoIndex } = newDateRecord;
        return createTodo(dateRecordId, todoIndex);
      }
    } catch (err) {
      throw new TRPCError({
        message: "SERVER_ERROR",
        code: "INTERNAL_SERVER_ERROR",
        cause: err,
      });
    }
  });

export default createTodo;

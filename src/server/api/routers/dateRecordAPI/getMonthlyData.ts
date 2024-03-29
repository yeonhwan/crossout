import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const getMonthlyData = protectedProcedure
  .input(
    z.object({
      data: z.object({
        field: z.enum(["todo", "daylog", "revenue"]),
      }),
      dateObject: z.object({
        year: z.number(),
        month: z.number(),
      }),
    })
  )
  .query(async ({ ctx, input }) => {
    const session = ctx.session;

    // CASE 3. USER DOES NOT EXISTS or MATCH
    const { id: userId } = session.user;
    const { year, month } = input.dateObject;
    const { field } = input.data;

    switch (field) {
      case "todo":
        const userWithdateRecordTodo = await ctx.prisma.user.findUniqueOrThrow({
          where: { id: userId },
          select: {
            dateRecords: {
              where: {
                year,
                month,
              },
              include: {
                _count: {
                  select: {
                    todos: true,
                  },
                },
                todos: {
                  select: {
                    completed: true,
                    content: true,
                    id: true,
                    urgency: true,
                    listBoard: true,
                  },
                },
              },
            },
          },
        });
        const dateRecordsTodo = userWithdateRecordTodo.dateRecords.filter(
          (data) => data.todos.length > 0
        );
        return { data: dateRecordsTodo, field: "todo" };

      case "daylog":
        const userWithdateRecordDaylog =
          await ctx.prisma.user.findUniqueOrThrow({
            where: { id: userId },
            select: {
              dateRecords: {
                where: {
                  year,
                  month,
                },
                select: {
                  date: true,
                  daylogs: {
                    select: {
                      mood: true,
                      content: true,
                    },
                  },
                },
              },
            },
          });
        const dateRecordsDaylog = userWithdateRecordDaylog.dateRecords.filter(
          (data) => data.daylogs
        );
        return { data: dateRecordsDaylog, field: "daylog" };

      case "revenue":
        const userWithdateRecordRevenue =
          await ctx.prisma.user.findUniqueOrThrow({
            where: { id: userId },
            select: {
              dateRecords: {
                where: {
                  year,
                  month,
                },
                select: {
                  date: true,
                  revenues: {
                    select: {
                      purpose: true,
                      revenue: true,
                      id: true,
                    },
                  },
                },
              },
            },
          });

        const dateRecordsRevenue = userWithdateRecordRevenue.dateRecords.filter(
          (data) => data.revenues.length > 0
        );

        return { data: dateRecordsRevenue, field: "revenue" };

      default:
        throw new TRPCError({ message: "BAD REQUEST", code: "BAD_REQUEST" });
    }
  });

export default getMonthlyData;

import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type DateRecord } from "@prisma/client";
import { dateIndexFormatter } from "@/utils/dateIndexFormatter";

const createRevenue = protectedProcedure
  .input(
    z.object({
      data: z.object({
        purpose: z.string().min(1).max(45),
        revenue: z.number().gt(0).or(z.number().lt(0)),
      }),
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
    const { purpose, revenue } = input.data;
    const { year, month, date } = input.dateObj;

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
        const { id: dateRecordId } = dateRecord;

        const newRevenue = await ctx.prisma.revenue.create({
          data: {
            userId,
            dateRecordId,
            purpose,
            revenue,
          },
        });

        return {
          data: {
            id: newRevenue.id,
            dateRecordId: newRevenue.dateRecordId,
            content: newRevenue.purpose,
            message: "Successfully Created",
          },
        };
      } else {
        const newdateRecord = await ctx.prisma.dateRecord.create({
          data: {
            userId,
            year,
            month,
            date,
            dateIndex: dateIndexFormatter(year, month, date),
          },
        });

        const { id: dateRecordId } = newdateRecord;

        const newRevenue = await ctx.prisma.revenue.create({
          data: {
            userId,
            dateRecordId,
            purpose,
            revenue,
          },
        });

        return {
          data: {
            id: newRevenue.id,
            dateRecordId: newRevenue.dateRecordId,
            content: newRevenue.purpose,
            message: "Successfully Created",
          },
        };
      }
    } catch (err) {
      throw new TRPCError({
        message: "SERVER ERROR",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });

export default createRevenue;

import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// auth
import tokenVerify from "@/server/api/routers/auth/tokenVerify";

const createRevenue = protectedProcedure
  .input(
    z.object({
      data: z.object({
        purpose: z.string(),
        revenue: z.number(),
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

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    // CASE 3. USER DOES NOT EXISTS or MATCH
    const { id: userId } = session.user;
    const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new TRPCError({ message: "BAD_REQUEST", code: "BAD_REQUEST" });
    }

    const { data, dateObj } = input;
    const { purpose, revenue } = data;

    try {
      const dateRecord = await ctx.prisma.dateRecord.findUnique({
        where: { year_month_date: dateObj },
      });

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
            content: newRevenue.purpose,
            message: "Successfully Created",
          },
        };
      } else {
        const newdateRecord = await ctx.prisma.dateRecord.create({
          data: {
            userId,
            year: dateObj.year,
            month: dateObj.month,
            date: dateObj.date,
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

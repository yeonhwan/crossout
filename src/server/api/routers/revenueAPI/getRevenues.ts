import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type RevenueClient } from "@/types/client";

const getRevenues = protectedProcedure
  .input(
    z.object({
      dateObj: z.object({
        year: z.number(),
        month: z.number(),
        date: z.number(),
      }),
    })
  )
  .query(async ({ ctx, input }) => {
    const session = ctx.session;
    // 1. Find User with the given userId
    // 2. Find Dayrecord with the given dateObj
    // 3. Query all todos in related Dayrecord

    const { id: userId } = session.user;
    const { year, month, date } = input.dateObj;

    try {
      const userDateRecordWithRevenue = await ctx.prisma.user.findUniqueOrThrow(
        {
          where: { id: userId },
          select: {
            dateRecords: {
              where: { year, month, date },
              select: {
                revenues: true,
              },
            },
          },
        }
      );

      const dateRecordWithRevnue = userDateRecordWithRevenue.dateRecords[0];

      if (dateRecordWithRevnue) {
        const revenue = dateRecordWithRevnue.revenues;
        return { data: revenue as unknown as RevenueClient[] };
      } else {
        return { data: undefined };
      }
    } catch (err) {
      throw new TRPCError({
        message: "SERVER_ERROR",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });
export default getRevenues;

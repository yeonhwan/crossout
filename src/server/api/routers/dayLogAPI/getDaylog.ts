import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const getDaylog = protectedProcedure
  .input(
    z.object({
      data: z.object({
        dateObject: z.object({
          year: z.number(),
          month: z.number(),
          date: z.number(),
        }),
      }),
    })
  )
  .query(async ({ ctx, input }) => {
    const session = ctx.session;
    const { id: userId } = session.user;
    const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new TRPCError({ message: "BAD_REQUEST", code: "BAD_REQUEST" });
    }

    const { year, month, date } = input.data.dateObject;

    const dateRecordWithDaylog = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        dateRecords: {
          where: { year, month, date },
          select: {
            daylogs: true,
          },
        },
      },
    });

    const dateRecord = dateRecordWithDaylog.dateRecords[0];
    if (!dateRecord) return { data: undefined };

    const daylog = dateRecord.daylogs;
    if (!daylog) return { data: undefined };

    return {
      data: {
        mood: daylog.mood,
        content: JSON.stringify(daylog.content),
      },
    };
  });

export default getDaylog;

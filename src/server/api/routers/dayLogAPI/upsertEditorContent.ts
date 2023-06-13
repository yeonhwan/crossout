import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type Prisma, type DateRecord } from "@prisma/client";

const upsertEditorContent = protectedProcedure
  .input(
    z.object({
      data: z.object({
        content: z.string(),
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
    // CASE 3. USER DOES NOT EXISTS or MATCH
    const { id: userId } = session.user;
    const { year, month, date } = input.dateObj;
    const { content } = input.data;
    const contentDataJson = JSON.parse(content) as Prisma.JsonObject;

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
      const newDaylog = await ctx.prisma.dayLog.upsert({
        where: {
          dateRecordId,
        },
        create: {
          dateRecordId,
          userId,
          content: contentDataJson,
        },
        update: {
          content: contentDataJson,
        },
        select: {
          content: true,
        },
      });
      return { data: { message: "Successfully Upserted", daylog: newDaylog } };
    } else {
      const dateRecord = await ctx.prisma.dateRecord.create({
        data: {
          userId,
          year,
          month,
          date,
        },
      });
      const { id: dateRecordId } = dateRecord;
      const newDaylog = await ctx.prisma.dayLog.upsert({
        where: {
          dateRecordId,
        },
        create: {
          dateRecordId,
          userId,
          content: contentDataJson,
        },
        update: {
          content: contentDataJson,
        },
        select: {
          content: true,
        },
      });
      return { data: { message: "Successfully Upserted", daylog: newDaylog } };
    }
  });

export default upsertEditorContent;

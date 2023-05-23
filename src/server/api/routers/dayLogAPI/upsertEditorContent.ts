import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// verify
import tokenVerify from "@/server/api/routers/auth/tokenVerify";
import { type Prisma } from "@prisma/client";

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

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    // CASE 3. USER DOES NOT EXISTS or MATCH
    const { id: userId } = session.user;
    const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new TRPCError({ message: "BAD_REQUEST", code: "BAD_REQUEST" });
    }

    const { content } = input.data;
    const { dateObj } = input;
    const contentDataJson = JSON.parse(content) as Prisma.JsonObject;

    const dateRecord = await ctx.prisma.dateRecord.findUnique({
      where: { year_month_date: dateObj },
    });

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
          year: dateObj.year,
          month: dateObj.month,
          date: dateObj.date,
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

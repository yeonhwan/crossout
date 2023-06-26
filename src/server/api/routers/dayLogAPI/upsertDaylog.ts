import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { dateIndexFormatter } from "@/utils/dateIndexFormatter";

import {
  type DateRecord,
  type DayLog,
  type Mood,
  type Prisma,
} from "@prisma/client";

const upsertDaylog = protectedProcedure
  .input(
    z.object({
      data: z.object({
        mood: z.string(),
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
    const { id: userId } = session.user;
    const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new TRPCError({ message: "BAD_REQUEST", code: "BAD_REQUEST" });
    }

    const { content, mood } = input.data;
    const { year, month, date } = input.dateObj;
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

    const upsertDaylogDB = async (dateRecordId: number): Promise<DayLog> => {
      return await ctx.prisma.dayLog.upsert({
        where: {
          dateRecordId,
        },
        create: {
          dateRecordId,
          userId,
          mood: mood as Mood,
          content: contentDataJson,
        },
        update: {
          mood: mood as Mood,
          content: contentDataJson,
        },
      });
    };

    const upsertDaylogProcessor = async (
      dateRecord: DateRecord | null
    ): Promise<DayLog> => {
      if (dateRecord) {
        const { id: dateRecordId } = dateRecord;
        const newDaylog = await upsertDaylogDB(dateRecordId);
        return newDaylog;
      } else {
        const dateRecord = await ctx.prisma.dateRecord.create({
          data: {
            userId,
            year,
            month,
            date,
            dateIndex: dateIndexFormatter(year, month, date),
          },
        });
        const { id: dateRecordId } = dateRecord;
        const newDaylog = await upsertDaylogDB(dateRecordId);
        return newDaylog;
      }
    };

    try {
      const daylog = await upsertDaylogProcessor(dateRecord);
      return { data: { message: "Successfully Upserted", daylog } };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          const retryCount = 3;
          let count = 0;
          while (count < retryCount) {
            await upsertDaylogProcessor(dateRecord);
            count++;
          }

          throw new TRPCError({
            message: "SERVER ERROR",
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      } else {
        throw new TRPCError({
          message: "SERVER ERROR",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  });

export default upsertDaylog;

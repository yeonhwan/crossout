import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

// verify
import tokenVerify from "@/server/api/routers/auth/tokenVerify";
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

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    // CASE 3. USER DOES NOT EXISTS or MATCH
    const { id: userId } = session.user;
    const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new TRPCError({ message: "BAD_REQUEST", code: "BAD_REQUEST" });
    }

    const { content, mood } = input.data;
    const { dateObj } = input;
    const contentDataJson = JSON.parse(content) as Prisma.JsonObject;

    const dateRecord = await ctx.prisma.dateRecord.findUnique({
      where: { year_month_date: dateObj },
    });

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
            year: dateObj.year,
            month: dateObj.month,
            date: dateObj.date,
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

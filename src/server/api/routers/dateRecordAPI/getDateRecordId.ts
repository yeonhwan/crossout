import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// verify
import tokenVerify from "@/server/api/routers/auth/tokenVerify";

const getDateRecordId = protectedProcedure
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

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    // CASE 3. USER DOES NOT EXISTS or MATCH
    const { id: userId } = session.user;
    const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new TRPCError({ message: "BAD_REQUEST", code: "BAD_REQUEST" });
    }

    const { year, month, date } = input.data.dateObject;

    const dateRecord = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        dateRecords: {
          where: { year, month, date },
          select: {
            id: true,
          },
        },
      },
    });

    const dateRecordId = dateRecord.dateRecords[0]?.id;

    return {
      data: { message: "Successfully Queried", data: dateRecordId },
    };
  });

export default getDateRecordId;

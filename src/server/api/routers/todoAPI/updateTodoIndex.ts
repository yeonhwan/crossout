import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import array from "lodash";

// auth
import tokenVerify from "../auth/tokenVerify";
import { type Prisma } from "@prisma/client";

const updateTodoIndex = protectedProcedure
  .input(
    z.object({
      data: z.object({ dateRecordId: z.number(), index: z.array(z.number()) }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const session = ctx.session;

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    const { dateRecordId, index } = input.data;

    // console.log(dateRecordId, index);

    const dateRecord = await ctx.prisma.dateRecord.findUnique({
      where: { id: dateRecordId },
      select: { todoIndex: true },
    });
    if (!dateRecord)
      throw new TRPCError({ message: "NOT FOUND", code: "NOT_FOUND" });

    const currentIndex = dateRecord.todoIndex as Prisma.JsonArray;

    // console.log(currentIndex);

    if (array.xor(currentIndex, index).length) {
      throw new TRPCError({ message: "BAD REQUEST", code: "BAD_REQUEST" });
    }

    // console.log(array.xor(currentIndex, index).length);

    const newRecord = await ctx.prisma.dateRecord.update({
      where: { id: dateRecordId },
      data: { todoIndex: index },
    });

    // console.log(newRecord);

    return { data: newRecord, message: "Successfuly Updated" };
  });

export default updateTodoIndex;

import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import array from "lodash";
import { type Prisma } from "@prisma/client";

const updateTodoIndex = protectedProcedure
  .input(
    z.object({
      data: z.object({ dateRecordId: z.number(), index: z.array(z.number()) }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { dateRecordId, index } = input.data;

    const dateRecord = await ctx.prisma.dateRecord.findUnique({
      where: { id: dateRecordId },
      select: { todoIndex: true },
    });
    if (!dateRecord)
      throw new TRPCError({ message: "NOT FOUND", code: "NOT_FOUND" });

    const currentIndex = dateRecord.todoIndex as Prisma.JsonArray;

    if (array.xor(currentIndex, index).length) {
      throw new TRPCError({ message: "BAD REQUEST", code: "BAD_REQUEST" });
    }

    const newRecord = await ctx.prisma.dateRecord.update({
      where: { id: dateRecordId },
      data: { todoIndex: index },
    });

    return { data: newRecord, message: "Successfuly Updated" };
  });

export default updateTodoIndex;

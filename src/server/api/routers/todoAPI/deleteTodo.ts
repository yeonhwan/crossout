import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type Prisma } from "@prisma/client";

// auth
import tokenVerify from "../auth/tokenVerify";

const deleteTodo = protectedProcedure
  .input(
    z.object({
      data: z.object({
        id: z.number(),
        dateRecordId: z.number(),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const session = ctx.session;

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    const { id, dateRecordId } = input.data;

    // delete a todo dateRecordId's todo's todosIndex
    const dateRecord = await ctx.prisma.dateRecord.findUniqueOrThrow({
      where: { id: dateRecordId },
      select: { todoIndex: true },
    });

    const currentTodoIndex = dateRecord.todoIndex as Prisma.JsonArray;
    const newToodIndex = currentTodoIndex.filter(
      (index) => index !== id
    ) as Prisma.JsonArray;

    const newDateRecord = await ctx.prisma.dateRecord.update({
      where: { id: dateRecordId },
      data: { todoIndex: newToodIndex },
    });

    if (!newDateRecord)
      throw new TRPCError({
        message: "UPDATE FAILED",
        code: "INTERNAL_SERVER_ERROR",
      });

    // RecordNotFound error when id is not correct
    const todo = await ctx.prisma.todo.delete({
      where: { id },
    });

    if (todo) {
      return {
        data: { content: todo.content, message: "Successfuly Deleted" },
      };
    } else {
      throw new TRPCError({
        message: "SERVER ERROR",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });

export default deleteTodo;

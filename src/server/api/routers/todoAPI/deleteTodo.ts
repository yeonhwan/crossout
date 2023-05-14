import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// auth
import tokenVerify from "../auth/tokenVerify";

const deleteTodo = protectedProcedure
  .input(
    z.object({
      data: z.object({
        id: z.number(),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const session = ctx.session;

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    const { id } = input.data;

    // RecordNotFound error when id is not correct
    const todo = await ctx.prisma.todo.delete({
      where: { id },
    });

    if (todo) {
      return { data: todo };
    } else {
      throw new TRPCError({
        message: "SERVER ERROR",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });

export default deleteTodo;

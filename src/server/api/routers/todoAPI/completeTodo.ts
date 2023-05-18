import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// auth
import tokenVerify from "../auth/tokenVerify";

const completeTodo = protectedProcedure
  .input(
    z.object({
      data: z.object({
        id: z.number(),
        completed: z.boolean(),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const session = ctx.session;

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    const { id, completed } = input.data;

    // prisma update does RecordNotFound check & redundant update (checking if it is undefined)
    const todo = await ctx.prisma.todo.update({
      where: { id },
      data: {
        completed,
      },
    });

    if (todo) {
      if (completed) {
        return {
          data: {
            content: todo.content,
            todo: todo,
            message: "Completed Todo",
          },
        };
      } else {
        return {
          data: {
            content: todo.content,
            todo: todo,
            message: "Restore Todo",
          },
        };
      }
    } else {
      throw new TRPCError({
        message: "SERVER ERROR",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });

export default completeTodo;

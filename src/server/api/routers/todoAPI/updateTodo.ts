import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// auth
import tokenVerify from "../auth/tokenVerify";

const Urgency = ["urgent", "important", "trivial"] as const;

const updateTodo = protectedProcedure
  .input(
    z.object({
      data: z.object({
        id: z.number(),
        content: z.optional(z.string().min(1)),
        urgency: z.optional(z.enum(Urgency)),
        listBoardId: z.optional(z.number()),
        deadline: z.optional(z.date()),
        completed: z.optional(z.boolean()),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const session = ctx.session;

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    const { id, content, urgency, listBoardId, deadline, completed } =
      input.data;

    // prisma update does RecordNotFound check & redundant update (checking if it is undefined)
    const todo = await ctx.prisma.todo.update({
      where: { id },
      data: {
        content: content ? content : undefined,
        urgency: urgency ? urgency : undefined,
        listBoardId: listBoardId ? listBoardId : undefined,
        deadline: deadline ? deadline : undefined,
        completed: completed ? completed : undefined,
      },
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

export default updateTodo;

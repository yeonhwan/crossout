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
        content: z.optional(z.string().min(1)).or(z.null()),
        urgency: z.optional(z.enum(Urgency)).or(z.null()),
        listBoardId: z.optional(z.number()),
        deadline: z.optional(z.date()).or(z.null()),
        completed: z.optional(z.boolean()).or(z.null()),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const session = ctx.session;

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    const { id, content, urgency, listBoardId, deadline } = input.data;

    console.log(input);

    // prisma update does RecordNotFound check & redundant update (checking if it is undefined)
    const todo = await ctx.prisma.todo.update({
      where: { id },
      data: {
        content: content ? content : undefined,
        urgency: urgency ? urgency : undefined,
        listBoardId: listBoardId ? listBoardId : undefined,
        deadline: deadline ? deadline : undefined,
      },
      include: {
        listBoard: true,
      },
    });

    if (todo) {
      return {
        data: {
          content: todo.content,
          todo: todo,
          message: "Successfuly Updated",
        },
      };
    } else {
      throw new TRPCError({
        message: "SERVER ERROR",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });

export default updateTodo;

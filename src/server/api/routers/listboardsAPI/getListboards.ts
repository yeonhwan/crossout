import { z } from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { type ListBoard } from "@prisma/client";

const getListboards = protectedProcedure
  .input(
    z.object({
      data: z.object({
        todos: z.optional(z.boolean()),
      }),
    })
  )
  .query(async ({ ctx, input }) => {
    const session = ctx.session;
    const { id } = session.user;
    const { todos } = input.data;

    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        listBoards: {
          include: { todos: todos ? { include: { listBoard: true } } : false },
        },
      },
    });

    const { listBoards } = user;
    if (todos) {
      return { data: listBoards };
    } else {
      return { data: listBoards as ListBoard[] };
    }
  });

export default getListboards;

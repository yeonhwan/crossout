import { z } from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

// verify
import tokenVerify from "@/server/api/routers/auth/tokenVerify";

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

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id },
      select: { listBoards: { include: { todos } } },
    });

    const { listBoards } = user;

    return { data: listBoards };
  });

export default getListboards;

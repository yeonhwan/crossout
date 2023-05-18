import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// verify
import tokenVerify from "@/server/api/routers/auth/tokenVerify";

const getListboards = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const session = ctx.session;

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    const { id } = input;

    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id },
      select: { listBoards: true },
    });

    const { listBoards } = user;

    return { data: listBoards };
  });

export default getListboards;

import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// verify
import tokenVerify from "@/server/api/routers/auth/tokenVerify";

const deleteListboard = protectedProcedure
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

    const listboard = await ctx.prisma.listBoard.delete({
      where: { id },
    });

    return {
      data: listboard,
      message: "Successfully Deleted",
      content: listboard.title,
    };
  });

export default deleteListboard;

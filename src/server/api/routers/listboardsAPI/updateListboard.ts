import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// verify
import tokenVerify from "@/server/api/routers/auth/tokenVerify";

const updateListboard = protectedProcedure
  .input(
    z.object({
      data: z.object({
        id: z.number(),
        description: z.optional(z.string()),
        title: z.string(),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const session = ctx.session;

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    const { title, description, id } = input.data;

    const listboard = await ctx.prisma.listBoard.update({
      where: { id },
      data: {
        title: title ? title : undefined,
        description: description ? description : undefined,
      },
    });

    return {
      data: listboard,
      message: "Successfully Updated",
      content: listboard.title,
    };
  });

export default updateListboard;

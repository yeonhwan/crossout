import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const setUsername = protectedProcedure
  .input(
    z.object({
      data: z.object({
        username: z.string().min(0).max(20),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const session = ctx.session;
    const { id: userId } = session.user;
    const { username } = input.data;
    try {
      const user = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: username,
        },
      });

      return { message: "successed", data: { username: user.name } };
    } catch (err) {
      throw new TRPCError({
        message: "update failed",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });

export default setUsername;

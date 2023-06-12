import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

// verify
import tokenVerify from "@/server/api/routers/auth/tokenVerify";

const setUserPreference = protectedProcedure
  .input(
    z.object({
      data: z.object({
        isLight: z.boolean(),
        background: z.string(),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const session = ctx.session;
    const { id: userId } = session.user;
    const { isLight, background } = input.data;
    console.log(input.data);

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }
    try {
      const userPreference = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          preference: {
            isLight,
            background,
          },
        },
      });

      return { message: "successed" };
    } catch (err) {
      throw new TRPCError({
        message: "update failed",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });

export default setUserPreference;

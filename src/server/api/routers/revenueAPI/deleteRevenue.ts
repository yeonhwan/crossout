import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// auth
import tokenVerify from "../auth/tokenVerify";

const deleteRevenue = protectedProcedure
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

    try {
      const deleteRevenue = await ctx.prisma.revenue.delete({
        where: {
          id,
        },
      });

      return {
        data: {
          content: deleteRevenue.purpose,
          message: "Successfully Deleted",
        },
      };
    } catch (err) {
      throw new TRPCError({
        message: "SERVER ERROR",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });

export default deleteRevenue;

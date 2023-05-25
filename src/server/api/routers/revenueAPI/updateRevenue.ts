import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// auth
import tokenVerify from "@/server/api/routers/auth/tokenVerify";

const updateRevenue = protectedProcedure
  .input(
    z.object({
      data: z.object({
        id: z.number(),
        purpose: z.string(),
        revenue: z.number(),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const session = ctx.session;

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    const { id, purpose, revenue } = input.data;

    try {
      const updatedRevenue = await ctx.prisma.revenue.update({
        where: { id },
        data: {
          purpose: purpose ? purpose : undefined,
          revenue: revenue ? revenue : undefined,
        },
      });

      if (updatedRevenue) {
        return {
          data: {
            content: updatedRevenue.purpose,
            message: "Successfully Updated",
          },
        };
      } else {
        throw new TRPCError({
          message: "SERVER ERROR",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    } catch (err) {
      throw new TRPCError({
        message: "SERVER ERROR",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });

export default updateRevenue;
import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const updateRevenue = protectedProcedure
  .input(
    z.object({
      data: z.object({
        id: z.number(),
        purpose: z.string().min(1).max(45),
        revenue: z.number().gt(0).or(z.number().lt(0)),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
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
            revenue: updatedRevenue,
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

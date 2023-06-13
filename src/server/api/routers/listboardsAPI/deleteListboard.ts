import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const deleteListboard = protectedProcedure
  .input(
    z.object({
      data: z.object({
        id: z.number(),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { id } = input.data;

      await ctx.prisma.listBoard.update({
        where: { id },
        data: {
          todos: {
            set: [],
          },
        },
      });

      const listboard = await ctx.prisma.listBoard.delete({
        where: { id },
      });

      return {
        data: listboard,
        message: "Successfully Deleted",
        content: listboard.title,
      };
    } catch (err) {
      throw new TRPCError({
        message: "SERVER ERROR",
        code: "INTERNAL_SERVER_ERROR",
        cause: err,
      });
    }
  });

export default deleteListboard;

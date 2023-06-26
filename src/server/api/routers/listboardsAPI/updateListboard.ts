import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const updateListboard = protectedProcedure
  .input(
    z.object({
      data: z.object({
        id: z.number(),
        description: z.optional(z.string()),
        title: z.optional(z.string().min(1).max(30)),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
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
    } catch (err) {
      throw new TRPCError({
        message: "SERVER ERROR",
        code: "INTERNAL_SERVER_ERROR",
        cause: err,
      });
    }
  });

export default updateListboard;

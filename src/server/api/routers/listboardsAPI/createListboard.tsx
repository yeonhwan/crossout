import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// verify
import tokenVerify from "@/server/api/routers/auth/tokenVerify";

const createListboard = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      description: z.optional(z.string()),
      title: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const session = ctx.session;

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    const { id, description, title } = input;

    const user = await ctx.prisma.user.findUniqueOrThrow({ where: { id } });

    if (!user)
      throw new TRPCError({ message: "BAD REQUEST", code: "BAD_REQUEST" });

    if (description) {
      const newListboard = await ctx.prisma.listBoard.create({
        data: { userId: id, title, description },
      });
      return {
        data: newListboard,
        message: "Successfully Created",
        content: newListboard.title,
      };
    } else {
      const newListboard = await ctx.prisma.listBoard.create({
        data: { userId: id, title },
      });
      return {
        data: newListboard,
        message: "Successfully Created",
        content: newListboard.title,
      };
    }
  });

export default createListboard;

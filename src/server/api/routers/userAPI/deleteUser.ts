import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

// verify
import tokenVerify from "@/server/api/routers/auth/tokenVerify";

const deleteUser = protectedProcedure.mutation(async ({ ctx }) => {
  const session = ctx.session;
  const { id: userId } = session.user;

  if (!tokenVerify(session)) {
    throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
  }

  try {
    const user = await ctx.prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return {
      data: {
        message: "Successfully Deleted",
        data: user,
      },
    };
  } catch (err) {
    throw new TRPCError({
      message: "SERVER ERROR",
      code: "INTERNAL_SERVER_ERROR",
      cause: err,
    });
  }
});

export default deleteUser;

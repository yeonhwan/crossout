import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

// verify
import tokenVerify from "@/server/api/routers/auth/tokenVerify";

const getListboards = protectedProcedure.query(async ({ ctx }) => {
  const session = ctx.session;
  const { id } = session.user;

  if (!tokenVerify(session)) {
    throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
  }

  const user = await ctx.prisma.user.findUniqueOrThrow({
    where: { id },
    select: { listBoards: { include: { todos: true } } },
  });

  const { listBoards } = user;

  return { data: listBoards };
});

export default getListboards;

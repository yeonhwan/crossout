import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { type UserDataState } from "@/types/client";

// verify
import tokenVerify from "@/server/api/routers/auth/tokenVerify";
import { type PreferenceState } from "@/types/client";

const getUserData = protectedProcedure.query(async ({ ctx }) => {
  const session = ctx.session;
  const { id: userId } = session.user;

  if (!tokenVerify(session)) {
    throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
  }

  const userPreference = await ctx.prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      preference: true,
      name: true,
    },
  });

  const { preference, name } = userPreference;

  return {
    data: {
      preference: preference as PreferenceState,
      username: name,
    } as UserDataState,
  };
});

export default getUserData;

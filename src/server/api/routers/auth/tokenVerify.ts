import { type Session } from "next-auth";
import { TRPCError } from "@trpc/server";

const tokenVerify = (session: Session): boolean => {
  // CASE 1. USER HAS NOT SIGNED IN
  if (!session) {
    throw new TRPCError({ message: "BAD_REQUEST", code: "BAD_REQUEST" });
  }

  // CASE 2. TOKEN EXPIRED
  const { expires } = session;
  const now = new Date().getTime();
  const token_expires = new Date(expires).getTime();
  if (token_expires - now < 0) {
    throw new TRPCError({ message: "TOKEN_EXPIRED", code: "FORBIDDEN" });
  }

  return true;
};

export default tokenVerify;

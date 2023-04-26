import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

/**
 * TODO
 * 1. make a backend data verification
 * 1-1. is input are correct form?
 * 1-2. is this user already exists?
 * 1-3. is this user signed up only by oAuth and don't have password?
 * 1-4. is the password valid?
 */

export const signUpRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(z.object({ email: z.string().min(1), password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      // if a email is already taken, throw a error
      const user = await ctx.prisma.user.findUnique({ where: { email } });
      if (user) {
        throw new TRPCError({
          message: "The account already has signed up",
          code: "FORBIDDEN",
        });
      } else {
        // 1. encrypt the user password with the salt
        // 2. create a User and redirect the user to edit their profile
        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(password, salt);

        const user = await ctx.prisma.user.create({
          data: {
            email: email,
            password: hashed,
          },
        });

        return { data: { userId: user.id } };
      }
    }),
});

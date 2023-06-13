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
    .input(
      z.object({
        username: z.string().min(1).max(20),
        email: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { username, email, password } = input;

      if (!username || username.length > 20) {
        throw new TRPCError({
          message: "Invalid information. Check your information again.",
          code: "BAD_REQUEST",
        });
      }

      const EMAIL_REG_EXP = new RegExp(
        "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
      );

      const PASSWORD_REG_EXP = new RegExp(
        "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{6,16}$"
      );

      // wrong type of information (checking if its valid email form)
      if (!EMAIL_REG_EXP.test(email) || !PASSWORD_REG_EXP.test(password)) {
        throw new TRPCError({
          message: "Invalid information. Check your information again.",
          code: "BAD_REQUEST",
        });
      }

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
            name: username,
            email: email,
            password: hashed,
          },
        });

        return { data: { userId: user.id, username: user.name } };
      }
    }),
});

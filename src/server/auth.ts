import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import bcrypt from "bcryptjs";
import { router, TRPCError } from "@trpc/server";
import { type Prisma, type User } from "@prisma/client";
import { type DefaultJWT } from "next-auth/jwt";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      name: string | null;
      email: string;
      image: string | null;
      id: string;
      preference: Prisma.JsonValue;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    preference: Prisma.JsonValue;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    session({ session, token }) {
      if (token.user) {
        session.user.id = token.userId as string;
        session.user.name = token.username as string;
        session.user.preference = token.preference;
      }
      return session;
    },
    jwt({ token, account, user }) {
      if (account) {
        token.previderId = account.providerAccountId;
      }
      if (user) {
        token.preference = (user as User).preference;
        token.user = user;
        token.userId = user.id;
        token.username = user.name;
      }
      return token;
    },
  },
  pages: {
    signIn: "/signin",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECERET,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const EMAIL_REG_EXP = new RegExp(
          "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
        );

        // wrong type of information (checking if its valid email form)
        if (!EMAIL_REG_EXP.test(email)) {
          throw new TRPCError({
            message: "Invalid information. Check your information again.",
            code: "BAD_REQUEST",
          });
        }

        const user: User | null = await prisma.user.findUnique({
          where: { email },
        });
        if (user && user.password) {
          // login success
          if (bcrypt.compareSync(password, user.password)) {
            return user;
          }
          // user exists but incorrect information
          throw new TRPCError({
            message: "Email or Password is incorrect",
            code: "UNAUTHORIZED",
          });
        } else {
          // user does not exists
          throw new TRPCError({
            message: "User does not exists.",
            code: "NOT_FOUND",
          });
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

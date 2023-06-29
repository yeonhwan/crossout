// NextAuth
import { getServerAuthSession } from "@/server/auth";
// types
import { type GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";

function withSession<T>(
  getServerSideProps: (
    session: Session,
    ctx: GetServerSidePropsContext
  ) => Promise<T>
) {
  return async (context: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(context);
    if (!session)
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };

    return await getServerSideProps(session, context);
  };
}

export default withSession;

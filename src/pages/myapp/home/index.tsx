// Hooks
import { useState } from "react";
import { useAnimation } from "@/hooks/useAnimation";
import { createContext } from "react";

// Components
import DateTimer from "@/components/Timer/DateTimer";
import HomeTabs from "@/components/Tabs/HomeTabs";
import CalendarPopper from "@/components/Popper/CalendarPopper/CalendarPopper";
import Layout from "@/components/Layout";

// GSSP
import { appRouter } from "@/server/api/root";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createInnerTRPCContext } from "@/server/api/trpc";
import withSession from "@/utils/withSession";

// types
import { type InferGetServerSidePropsType } from "next";
import { type UserDataState } from "@/types/client";
import { type ListBoard } from "@prisma/client";

export const getServerSideProps = withSession<{
  props: {
    userData: UserDataState;
    listboardsData: { data: ListBoard[] };
  };
}>(async (session) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  });

  const userData = await helpers.user.getUserData.fetch();
  const listboards = await helpers.listboards.getListboards.fetch({
    data: { todos: false },
  });

  return {
    props: {
      userData: userData.data,
      listboardsData: listboards,
    },
  };
});

export const HomeContext = createContext<ListBoard[] | undefined>(undefined);

const Home = ({
  userData,
  listboardsData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const listboards = listboardsData.data;
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [shouldRender, animateTrigger, handleTransition] =
    useAnimation(isCalendarOpen);

  return (
    <Layout userData={userData}>
      <HomeContext.Provider value={listboards}>
        <main className="flex h-[90%] w-full flex-col">
          <div className="flex h-[10%] w-full justify-center">
            <DateTimer
              openCalendar={() => {
                setIsCalendarOpen(true);
              }}
            />
          </div>
          <div className="flex h-[90%] w-full">
            <HomeTabs />
          </div>
          {shouldRender && (
            <CalendarPopper
              animateTrigger={animateTrigger}
              handleTransition={handleTransition}
              closeCalendar={() => {
                setIsCalendarOpen(false);
              }}
            />
          )}
        </main>
      </HomeContext.Provider>
    </Layout>
  );
};

export default Home;

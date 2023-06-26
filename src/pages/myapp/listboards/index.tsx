// Hooks
import { useState } from "react";

// components
import ListView from "@/components/Lists/ListView";
import ListboardItem from "@/components/Lists/Items/ListboardItem";
import CircleButton from "@/components/Buttons/CircleButton";
import Dialog from "@/components/Dialog/Dialog";
import ListboardsForm from "@/components/Forms/ListboardsForm";
import NoListboards from "@/components/Graphic/NoListboards";
import Layout from "@/components/Layout";

import { motion } from "framer-motion";

// api
import { api } from "@/utils/api";

// types
import { type ListboardItemType } from "@/types/client";

// ICONS
import AddCardIcon from "@mui/icons-material/AddCard";
import LoaderIcon from "public/icons/spinner.svg";

// Types
import { type InferGetServerSidePropsType } from "next";
import { type UserDataState } from "@/types/client";

// GSSP
import { appRouter } from "@/server/api/root";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createInnerTRPCContext } from "@/server/api/trpc";
import withSession from "@/utils/withSession";

export const getServerSideProps = withSession<{
  props: {
    userData: UserDataState;
  };
}>(async (session) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  });
  const userData = await helpers.user.getUserData.fetch();

  return {
    props: {
      userData: userData.data,
    },
  };
});

const ListboardIndex = ({
  userData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isOpenListboardsDialog, setIsOpenListboardsDialog] = useState(false);
  const [listboardsData, setListboardsData] = useState<
    ListboardItemType[] | undefined
  >();
  const [popperData, setPopperData] = useState<ListboardItemType | null>(null);
  const [isProceed, setIsProceed] = useState(false);
  const [isMaskOn, setIsMaskOn] = useState(true);
  const [backDropOpen, setBackDropOpen] = useState(false);

  const openCreateListboard = () => {
    setIsOpenListboardsDialog(true);
  };

  api.listboards.getListboards.useQuery(
    { data: { todos: true } },
    {
      queryKey: ["listboards.getListboards", { data: { todos: true } }],
      onSuccess: (res) => {
        const { data } = res;
        setListboardsData(data as ListboardItemType[]);
        data.forEach((todo) => {
          if (todo.id === popperData?.id) {
            setPopperData(todo as ListboardItemType);
          }
        });
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const itemRender = () => {
    if (listboardsData && listboardsData.length) {
      return (
        <>
          <ListView
            maskOn={isMaskOn ? true : false}
            className="mt-5 grid grid-cols-listboard items-start justify-around gap-x-10 gap-y-8"
          >
            {listboardsData.map((data) => (
              <ListboardItem
                data={data}
                key={data.id}
                setIsProceed={setIsProceed}
                setMaskOn={setIsMaskOn}
                setBackDropOpen={setBackDropOpen}
              />
            ))}
          </ListView>
          <div
            className={`${
              backDropOpen ? "z-0" : "z-50"
            } flex self-end pr-4 sm:pr-0`}
          >
            <CircleButton
              className=""
              info="Add new listboard"
              onClick={openCreateListboard}
            >
              <AddCardIcon />
            </CircleButton>
          </div>
        </>
      );
    } else if (listboardsData && !listboardsData.length) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <NoListboards
            buttonHandler={() => {
              setIsOpenListboardsDialog(true);
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <LoaderIcon className="h-10 w-10 fill-neutral-600 dark:fill-white" />
        </div>
      );
    }
  };

  return (
    <Layout userData={userData}>
      <div className="flex h-[90%] max-h-[900px] min-h-[500px] w-full max-w-[1700px] flex-col px-5 sm:px-20 md:px-40 lg:min-h-[700px]">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-2 flex h-[7%] flex-col items-center sm:items-start"
        >
          <h1 className="text-4xl font-extrabold text-neutral-800 dark:text-neutral-300 sm:text-4xl">
            Listboards
          </h1>
          <p className="text-xs text-neutral-700 transition-colors dark:text-neutral-200 sm:text-lg">
            Manage your listboards, todos by listboard
          </p>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-4 flex h-[85%] w-full flex-col justify-center rounded-xl bg-neutral-300/40 px-0 py-5 pt-10 shadow-lg  transition-colors dark:bg-neutral-800/60 sm:h-[75%] sm:px-10"
        >
          <div
            className={`absolute left-0 top-0 h-screen w-screen bg-black/50 transition-opacity ${
              backDropOpen ? "z-10 opacity-100 backdrop-blur-md" : "opacity-0"
            }`}
          />
          {isProceed && (
            <div className="absolute right-4 top-4 h-max w-max">
              <LoaderIcon className="h-10 w-10" />
            </div>
          )}
          {itemRender()}
        </motion.div>
        <Dialog
          onClickAway={() => {
            setIsOpenListboardsDialog(false);
          }}
          openState={isOpenListboardsDialog}
        >
          <ListboardsForm setOpenDialog={setIsOpenListboardsDialog} />
        </Dialog>
      </div>
    </Layout>
  );
};

export default ListboardIndex;

// Next
import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";

// hooks
import { useState, useRef, useEffect } from "react";

// Icons
import AddIcon from "@mui/icons-material/Add";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";

// Components
import CircleButton from "@/components/Buttons/CircleButton";
import DateTimer from "@/components/Timer/DateTimer";
import HomeTabs from "@/components/Tabs/HomeTabs";
import Dialog from "@/components/Dialog/Dialog";
import TodoForm from "@/components/Forms/TodoForm";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [isOpenTodoDialog, setIsOpenTodoDialog] = useState(false);

  const openCreateTodo = () => {
    setIsOpenTodoDialog(true);
  };

  return (
    <>
      <Head>
        <title>Chill Today</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-[85%] w-full flex-col">
        <div className="flex w-full justify-center">
          <DateTimer />
        </div>
        <div className="flex h-full w-full">
          <HomeTabs />
        </div>
        <div className="absolute bottom-6 flex w-full justify-evenly px-60">
          <CircleButton
            info="Add Todo"
            clickHandler={openCreateTodo}
            className="mr-5"
          >
            <AddIcon />
          </CircleButton>
          <CircleButton
            info="Add Daylog"
            clickHandler={openCreateTodo}
            className="mr-5"
          >
            <EditCalendarIcon />
          </CircleButton>
          <CircleButton
            info="Add Revenues"
            clickHandler={openCreateTodo}
            className="mr-5"
          >
            <PriceCheckIcon />
          </CircleButton>
          <CircleButton
            info="Zen Mode"
            clickHandler={openCreateTodo}
            className="mr-5"
          >
            <SelfImprovementIcon />
          </CircleButton>
        </div>
        {/* Create Todo Dialog */}
        <Dialog
          onClickAway={() => {
            setIsOpenTodoDialog(false);
          }}
          openState={isOpenTodoDialog}
        >
          <TodoForm setOpenDialog={setIsOpenTodoDialog} />
        </Dialog>
        {/* Create Todo Dialog*/}
      </main>
    </>
  );
};

export default Home;

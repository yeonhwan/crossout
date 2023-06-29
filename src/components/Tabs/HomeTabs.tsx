// components
import TabPanel from "@/components/Tabs/TabPanel";
import TodoPanel from "@/components/Tabs/Panels/Todos/TodoPanel";
import DaylogPanel from "@/components/Tabs/Panels/Daylog/DaylogPanel";
import Dialog from "@/components/Dialog/Dialog";
import TodoForm from "@/components/Forms/TodoForm";
import RevenuePanel from "@/components/Tabs/Panels/Revenue/RevenuePanel";
import RevenueForm from "@/components/Forms/RevenueForm";

// hooks
import { useState, useRef } from "react";

// libs
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { motion, AnimatePresence } from "framer-motion";

// api
import { api } from "@/utils/api";

// store
import useDateStore from "@/stores/useDateStore";

//types
import type {
  GetTodoOutput,
  GetDayLogOutput,
  GetRevenuesOutput,
} from "@/utils/api";

enum TabPanels {
  todos = 0,
  daylog = 1,
  revenues = 2,
}

const HomeTabs = () => {
  const [tabValue, setTabValue] = useState<TabPanels>(TabPanels.todos);
  const [isOpenTodoDialog, setIsOpenTodoDialog] = useState(false);
  const [isOpenRevenueDialog, setIsOpenRevenueDialog] = useState(false);
  const [todoTabData, setTodoTabData] = useState<GetTodoOutput>();
  const [daylogTabData, setDaylogTabData] = useState<GetDayLogOutput>();
  const [revenueTabData, setRevenueTabData] = useState<GetRevenuesOutput>();
  const prevTabValue = useRef(tabValue);
  const { year, month, date } = useDateStore((state) => state.dateObj);

  const openCreateTodo = () => {
    setIsOpenTodoDialog(true);
  };

  const openCreateRevenue = () => {
    setIsOpenRevenueDialog(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const dateObj = { year, month, date };

  // get todo data for current day api call
  const { isLoading: todosDataLoading } = api.todo.getTodos.useQuery(
    { data: { dateObject: { year, month, date } } },
    {
      queryKey: [
        "todo.getTodos",
        { data: { dateObject: { year, month, date } } },
      ],
      onSuccess(res) {
        setTodoTabData(res);
      },
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  // get daylog data for current day api call
  const { isLoading: daylogDataLoading } = api.daylog.getDaylog.useQuery(
    { data: { dateObject: { year, month, date } } },
    {
      queryKey: [
        "daylog.getDaylog",
        { data: { dateObject: { year, month, date } } },
      ],
      onSuccess: (res) => {
        setDaylogTabData(res);
      },

      onError: (err) => {
        console.log(err);
      },
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  // get revenue data for current day api call
  const { isLoading: revenuesDataLoading } = api.revenue.getRevenues.useQuery(
    {
      dateObj,
    },
    {
      queryKey: ["revenue.getRevenues", { dateObj }],
      onSuccess: (res) => {
        setRevenueTabData(res);
      },
      onError: (err) => {
        console.log(err);
      },
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return (
    <div className="flex h-full w-full flex-col justify-center">
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="home tabs"
        centered
        className="mt-4 min-h-[36px] sm:min-h-[48px]"
        TabIndicatorProps={{
          className:
            "rounded-full h-8 sm:h-full bg-neutral-800/80 dark:bg-neutral-100/80 z-0 w-full mb-1 sm:mb-0 sm:mt-1",
        }}
      >
        <Tab
          className={`z-10 mr-2 h-8 w-20 rounded-full px-3 py-1 text-xs transition-colors hover:bg-neutral-500/30 dark:hover:bg-neutral-300/30 sm:mr-4 sm:h-12 sm:w-20 sm:px-4 ${
            tabValue === TabPanels.todos
              ? "text-white dark:text-neutral-800"
              : "dark:text-white"
          }`}
          label="Todos"
          disableRipple
          disabled={tabValue === TabPanels.todos}
          style={{
            minWidth: 50,
            minHeight: 20,
          }}
          onClick={() => {
            prevTabValue.current = tabValue;
          }}
        />
        <Tab
          className={`z-10 mr-2 h-8 w-20 rounded-full px-3 py-1 text-xs transition-colors hover:bg-neutral-500/30 dark:hover:bg-neutral-300/30 sm:mr-4 sm:h-12 sm:w-20 sm:px-4 sm:py-2  ${
            tabValue === TabPanels.daylog
              ? "text-white dark:text-neutral-800"
              : "dark:text-white"
          }`}
          label="DayLog"
          disableRipple
          disabled={tabValue === TabPanels.daylog}
          style={{
            minWidth: 50,
            minHeight: 20,
          }}
          onClick={() => {
            prevTabValue.current = tabValue;
          }}
        />
        <Tab
          className={`sm:text-md z-10 mr-2 h-8 w-20 rounded-full  px-3 py-1 text-xs transition-colors hover:bg-neutral-500/30 dark:hover:bg-neutral-300/30 sm:mr-4 sm:h-12 sm:w-20 sm:px-4 sm:py-2   ${
            tabValue === TabPanels.revenues
              ? "text-white dark:text-neutral-800"
              : "dark:text-white"
          }`}
          label="Revenues"
          disableRipple
          disabled={tabValue === TabPanels.revenues}
          style={{
            minWidth: 50,
            minHeight: 20,
          }}
          onClick={() => {
            prevTabValue.current = tabValue;
          }}
        />
      </Tabs>
      <AnimatePresence mode="wait">
        <motion.div
          key={`tabPanel-${tabValue}`}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex h-full
      w-full justify-center"
        >
          {tabValue === TabPanels.todos && (
            <TabPanel
              className="flex h-full
            w-full justify-center transition-tab"
              index={TabPanels.todos}
              value={TabPanels.todos}
            >
              <TodoPanel
                openCreateTodo={openCreateTodo}
                data={todoTabData?.data}
                isTodoLoading={todosDataLoading}
              />
            </TabPanel>
          )}
          {tabValue === TabPanels.daylog && (
            <TabPanel
              className="flex h-full
            w-full justify-center transition-tab"
              index={TabPanels.daylog}
              value={TabPanels.daylog}
            >
              <DaylogPanel
                data={daylogTabData?.data}
                isDaylogLoading={daylogDataLoading}
              />
            </TabPanel>
          )}
          {tabValue === TabPanels.revenues && (
            <TabPanel
              className="flex h-full
            w-full justify-center transition-tab"
              index={TabPanels.revenues}
              value={TabPanels.revenues}
            >
              <RevenuePanel
                isRevenuesLoading={revenuesDataLoading}
                data={revenueTabData?.data}
                openCreateRevenue={openCreateRevenue}
              />
            </TabPanel>
          )}
        </motion.div>
      </AnimatePresence>
      {/* Todo Dialog */}
      <Dialog
        onClickAway={() => {
          setIsOpenTodoDialog(false);
        }}
        openState={isOpenTodoDialog}
      >
        <TodoForm setOpenDialog={setIsOpenTodoDialog} />
      </Dialog>
      {/* Revenue Dialog */}
      <Dialog
        onClickAway={() => {
          setIsOpenRevenueDialog(false);
        }}
        openState={isOpenRevenueDialog}
      >
        <RevenueForm setOpenDialog={setIsOpenRevenueDialog} />
      </Dialog>
    </div>
  );
};

export default HomeTabs;

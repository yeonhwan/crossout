// hooks
import { useState } from "react";
import { createPortal } from "react-dom";

// Components
import TabPanel from "@/components/Tabs/TabPanel";
import TodoPanel from "@/components/Tabs/Panels/Todos/TodoPanel";
import DaylogPanel from "@/components/Tabs/Panels/Daylog/DaylogPanel";
import Dialog from "@/components/Dialog/Dialog";
import TodoForm from "@/components/Forms/TodoForm";
import RevenuePanel from "@/components/Tabs/Panels/Revenue/RevenuePanel";
import RevenueForm from "@/components/Forms/RevenueForm";

// libs
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

enum TabPanels {
  todos = 0,
  daylog = 1,
  revenues = 2,
}

const HomeTabs = () => {
  const [tabValue, setTabValue] = useState<TabPanels>(TabPanels.todos);
  const [isOpenTodoDialog, setIsOpenTodoDialog] = useState(false);
  const [isOpenRevenueDialog, setIsOpenRevenueDialog] = useState(false);

  const openCreateTodo = () => {
    setIsOpenTodoDialog(true);
  };

  const openCreateRevenue = () => {
    setIsOpenRevenueDialog(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
        />
      </Tabs>
      <TabPanel
        className={`${
          tabValue === 0 ? "flex" : "hidden"
        } h-full w-full justify-center`}
        index={TabPanels.todos}
        value={TabPanels.todos}
      >
        <TodoPanel
          openCreateTodo={openCreateTodo}
          enabled={tabValue === TabPanels.todos}
        />
      </TabPanel>
      <TabPanel
        className={`${
          tabValue === 1 ? "flex" : "hidden"
        } h-full w-full justify-center`}
        index={TabPanels.daylog}
        value={TabPanels.daylog}
      >
        <DaylogPanel />
      </TabPanel>
      <TabPanel
        className={`${
          tabValue === 2 ? "flex" : "hidden"
        } h-full w-full justify-center`}
        index={TabPanels.revenues}
        value={TabPanels.revenues}
      >
        <RevenuePanel openCreateRevenue={openCreateRevenue} />
      </TabPanel>
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

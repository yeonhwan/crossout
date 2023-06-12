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
        className="mt-4"
        TabIndicatorProps={{
          className:
            "rounded-full bg-neutral-800/80 dark:bg-neutral-100/80 z-0 w-full h-full",
        }}
      >
        <Tab
          className={`z-10 mr-4 rounded-full px-4 py-2 transition-colors  ${
            tabValue === TabPanels.todos
              ? "text-white dark:text-neutral-800"
              : "dark:text-white"
          }`}
          label="Todos"
          disableRipple
          disabled={tabValue === TabPanels.todos}
        />
        <Tab
          className={`z-10 mr-4 rounded-full px-4 py-2 transition-colors  ${
            tabValue === TabPanels.daylog
              ? "text-white dark:text-neutral-800"
              : "dark:text-white"
          }`}
          label="DayLog"
          disableRipple
          disabled={tabValue === TabPanels.daylog}
        />
        <Tab
          className={`z-10 mr-4 rounded-full px-4 py-2 transition-colors  ${
            tabValue === TabPanels.revenues
              ? "text-white dark:text-neutral-800"
              : "dark:text-white"
          }`}
          label="Revenues"
          disableRipple
          disabled={tabValue === TabPanels.revenues}
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

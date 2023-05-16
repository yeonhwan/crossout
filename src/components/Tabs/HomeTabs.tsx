// hooks
import { useState } from "react";

// Components
import TabPanel from "@/components/Tabs/TabPanel";
import ListView from "@/components/Lists/ListView";
import TodoPanel from "./Panels/Todos/TodoPanel";

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
          className: "rounded-full bg-neutral-800/80 z-0 w-full h-full",
        }}
      >
        <Tab
          className={`z-10 mr-4 rounded-full px-4 py-2 transition-colors delay-200 ${
            tabValue === TabPanels.todos ? "text-white" : ""
          }`}
          label="Todos"
          disableRipple
          disabled={tabValue === TabPanels.todos}
        />
        <Tab
          className={`z-10 mr-4 rounded-full px-4 py-2 transition-colors delay-200 ${
            tabValue === TabPanels.daylog ? "text-white" : ""
          }`}
          label="DayLog"
          disableRipple
          disabled={tabValue === TabPanels.daylog}
        />
        <Tab
          className={`z-10 mr-4 rounded-full px-4 py-2 transition-colors delay-200 ${
            tabValue === TabPanels.revenues ? "text-white" : ""
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
        <TodoPanel enabled={tabValue === TabPanels.todos} />
      </TabPanel>
      <TabPanel
        className={`${
          tabValue === 1 ? "flex" : "hidden"
        } h-full w-full justify-center`}
        index={TabPanels.daylog}
        value={TabPanels.daylog}
      >
        <ListView>
          <p>asdf</p>
        </ListView>
      </TabPanel>
      <TabPanel
        className={`${
          tabValue === 2 ? "flex" : "hidden"
        } h-full w-full justify-center`}
        index={TabPanels.revenues}
        value={TabPanels.revenues}
      >
        <ListView />
      </TabPanel>
    </div>
  );
};

export default HomeTabs;

// hooks
import { useState } from "react";

// Components
import TabPanel from "@/components/Tabs/TabPanel";
import ListView from "@/components/Lists/ListView";
import List from "@/components/Lists/List";
import TodoItem from "@/components/Items/TodoItem";

// libs
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// api
import { api } from "@/utils/api";
import { type GetTodoOutput } from "@/utils/api";

// stores
import useDateStore from "@/stores/useDateStore";

// styles
import loader_styles from "@/styles/loader.module.css";
import { type Todo } from "@prisma/client";

enum TabPanels {
  todos = 0,
  daylog = 1,
  revenues = 2,
}

// RENDERER PROPS TYPES
type RendererProps = {
  children: JSX.Element | JSX.Element[];
  isLoading: boolean;
};
const Renderer = ({ children, isLoading }: RendererProps) => {
  if (isLoading) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <span className="flex items-center justify-center">
          <span className={`ml-2 ${loader_styles.loader as string}`} />
        </span>
      </div>
    );
  } else {
    return <>{children}</>;
  }
};

const HomeTabs = () => {
  const [tabValue, setTabValue] = useState<TabPanels>(TabPanels.todos);
  const [todosData, setTodosData] = useState<Todo[] | null>(null);
  const { year, month, date } = useDateStore((state) => state.dateObj);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // getTodos
  const { isLoading: todoLoading } = api.todo.getTodos.useQuery(
    { dateObject: { year, month, date } },
    {
      queryKey: ["todo.getTodos", { dateObject: { year, month, date } }],
      onSuccess(res) {
        const { data } = res;
        if (data) {
          const { todos } = data;
          setTodosData(todos);
        }
      },
      enabled: tabValue === TabPanels.todos,
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
        <ListView>
          <Renderer isLoading={todoLoading}>
            {todosData ? (
              todosData.map((data) => (
                <List key={data.id}>
                  <TodoItem data={data} />
                </List>
              ))
            ) : (
              <p>null</p>
            )}
          </Renderer>
        </ListView>
      </TabPanel>
      <TabPanel
        className={`${
          tabValue === 1 ? "flex" : "hidden"
        } h-full w-full justify-center`}
        index={TabPanels.daylog}
        value={TabPanels.daylog}
      >
        <ListView />
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

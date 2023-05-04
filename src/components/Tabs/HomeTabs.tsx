// hooks
import { useState } from "react";

// Components
import TabPanel from "@/components/Tabs/TabPanel";
import ListView from "@/components/Lists/ListView";
import List from "@/components/Lists/List";

// libs
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const HomeTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="flex h-full w-full flex-col justify-center">
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        centered
        className="mt-4"
        TabIndicatorProps={{
          className: "rounded-full bg-neutral-800/80 z-0 w-full h-full",
        }}
      >
        <Tab
          className={`z-10 mr-4 rounded-full px-4 py-2 transition-colors delay-200 ${
            value === 0 ? "text-white" : ""
          }`}
          label="Todos"
          disableRipple
          disabled={value === 0}
        />
        <Tab
          className={`z-10 mr-4 rounded-full px-4 py-2 transition-colors delay-200 ${
            value === 1 ? "text-white" : ""
          }`}
          label="DayLog"
          disableRipple
          disabled={value === 1}
        />
        <Tab
          className={`z-10 mr-4 rounded-full px-4 py-2 transition-colors delay-200 ${
            value === 2 ? "text-white" : ""
          }`}
          label="Revenues"
          disableRipple
          disabled={value === 2}
        />
      </Tabs>
      <TabPanel
        className={`${
          value === 0 ? "flex" : "hidden"
        } h-full w-full justify-center`}
        index={0}
        value={value}
      >
        <ListView>
          <List>
            <div className="w-ful flex h-max">
              <p>dummy</p>
            </div>
          </List>
          <List>
            <div className="w-ful flex h-max">
              <p>dummy</p>
            </div>
          </List>
          <List>
            <div className="w-ful flex h-max">
              <p>dummy</p>
            </div>
          </List>
          <List>
            <div className="w-ful flex h-max">
              <p>dummy</p>
            </div>
          </List>
          <List>
            <div className="w-ful flex h-max">
              <p>dummy</p>
            </div>
          </List>
          <List>
            <div className="w-ful flex h-max">
              <p>dummy</p>
            </div>
          </List>
          <List>
            <div className="w-ful flex h-max">
              <p>dummy</p>
            </div>
          </List>
          <List>
            <div className="w-ful flex h-max">
              <p>dummy</p>
            </div>
          </List>
          <List>
            <div className="w-ful flex h-max">
              <p>dummy</p>
            </div>
          </List>
        </ListView>
      </TabPanel>
      <TabPanel
        className={`${
          value === 1 ? "flex" : "hidden"
        } h-full w-full justify-center`}
        index={1}
        value={value}
      >
        <ListView />
      </TabPanel>
      <TabPanel
        className={`${
          value === 2 ? "flex" : "hidden"
        } h-full w-full justify-center`}
        index={2}
        value={value}
      >
        <ListView />
      </TabPanel>
    </div>
  );
};

export default HomeTabs;

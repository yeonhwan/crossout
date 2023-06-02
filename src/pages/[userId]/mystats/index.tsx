// components
import CircleButton from "@/components/Buttons/CircleButton";
import DoughnutChart from "@/components/Charts/DoughnutChart";
import YearChart from "@/components/Charts/YearChart";
import MonthChart from "@/components/Charts/MonthChart";
import ChartCalenderPopper from "@/components/Popper/CalendarPopper/ChartCalendarPopper";

// hooks
import { useAnimation } from "@/hooks/useAnimation";
import React, { useState } from "react";

// icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// stroe
import useDateStore from "@/stores/useDateStore";

// types
import { type Dayjs } from "dayjs";

// trpc
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createInnerTRPCContext } from "@/server/api/trpc";

// routers
import { dateRecordRouter } from "@/server/api/routers/dateRecord";
import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/server/auth";
import superjson from "superjson";

// apis
import { api } from "@/utils/api";

import { type InferGetServerSidePropsType } from "next";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ message: "string" }>
) {
  const { req, res } = context;
  const session = await getServerAuthSession({ req, res });
  const helpers = createServerSideHelpers({
    router: dateRecordRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  });

  const result = await helpers.getYearlyChartData.fetch();

  const data = result.data;
  if (data) {
    return {
      props: {
        data,
      },
    };
  } else {
    throw new Error("SERVER ERROR");
  }
}

const Mystats = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { todos, revenues, moods } = data;

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [groupedBy, setGroupedBy] = useState<"month" | "year">("year");
  const [shouldRender, animateTrigger, handleTransition] =
    useAnimation(isCalendarOpen);
  const { dateObj } = useDateStore((state) => state);
  const [dateInput, setDateInput] = useState<Dayjs>(dateObj.now);
  const [todosData, setTodosData] = useState(todos);
  const [revenuesData, setRevenuesData] = useState(revenues);
  const [moodsData, setMoodsData] = useState(moods);
  const [todosDoughnutData, setTodosDoughnutData] = useState(todos.doughnut);
  const [revenuesDoughnutData, setRevenuesDoughnutData] = useState(
    revenues.doughnut
  );
  const [moodsDoughnutData, setMoodsDoughnutData] = useState(moods.doughnut);
  const [selectedField, setSelectedField] = useState<
    "todo" | "revenue" | "mood"
  >("todo");

  const setDefaultDateInput = () => {
    setDateInput(dateObj.now);
  };

  const yearChartDataDistribute = (field: "todo" | "revenue" | "mood") => {
    if (field === "todo") return todosData.data;
    if (field === "revenue") return revenuesData.data;
    if (field === "mood") return moodsData.data;

    throw new Error("Not correct field");
  };

  return (
    <div className="relative flex h-full w-full flex-col px-28">
      <h1 className="text-4xl font-extrabold text-neutral-300">My Stats</h1>
      <p className="text-lg font-semibold text-neutral-700">
        See your daily life in total with monthly, weekly view in here!
      </p>
      <div className="mt-4 flex h-[80%] max-h-[600px] w-full justify-evenly rounded-xl bg-neutral-800/40 p-6 backdrop-blur-md">
        <div className="relative flex h-full w-[20%] flex-col justify-between rounded-xl">
          <div className="flex h-[12%] w-full flex-col items-center justify-evenly">
            <div className="flex w-[50%] items-center justify-evenly">
              <select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSelectedField(
                    e.currentTarget.value as "todo" | "revenue" | "mood"
                  );
                }}
                value={selectedField}
                className="h-6 rounded-xl bg-neutral-700 text-center text-xs text-white hover:cursor-pointer"
              >
                category
                <option value="todo">todo</option>
                <option value="revenue">revenue</option>
                <option value="mood">mood</option>
              </select>
              <CircleButton
                onClick={() => {
                  setIsCalendarOpen(true);
                }}
                className="p-1"
              >
                <CalendarMonthIcon className="h-3 w-3" />
              </CircleButton>
            </div>
            <p className="mt-2 rounded-xl bg-neutral-700 px-2 py-1 text-xs text-white">
              2023 May
            </p>
          </div>
          <div className="flex h-[55%] w-full items-center justify-center rounded-xl bg-neutral-400/30 p-4 shadow-lg">
            <DoughnutChart
              data={
                selectedField === "todo"
                  ? todosDoughnutData
                  : selectedField === "revenue"
                  ? revenuesDoughnutData
                  : moodsDoughnutData
              }
              selectedField={selectedField}
            />
          </div>
          <div className="flex h-[25%] w-full flex-col items-center justify-center rounded-xl bg-neutral-400/30 shadow-lg">
            <p className="w-2/3 text-xl font-bold text-white">
              <span className="mr-2 text-sm font-semibold">Total:</span>
              30
            </p>
            <p className="w-2/3 text-lg font-bold text-white">
              <span className="mr-2 text-sm font-semibold">Completed:</span>
              70%
            </p>
          </div>
        </div>
        <div className="flex h-full w-[75%] flex-col justify-between px-4">
          <div className="flex h-[60%] w-full overflow-x-scroll rounded-xl bg-neutral-700 shadow-lg lg:items-center lg:justify-center">
            <YearChart
              data={yearChartDataDistribute(selectedField)}
              selectedField={selectedField}
            />
            {/* <MonthChart /> */}
          </div>
          <div className="flex h-[35%] w-full justify-between">
            <div className="flex h-full w-[23%] flex-col items-center justify-center rounded-xl bg-neutral-300 shadow-lg">
              <p className="font-bold">Most Busy Day</p>
              <p className="font-semibold">2023 05 03</p>
            </div>
            <div className="flex h-full w-[23%] rounded-xl bg-neutral-300 shadow-lg"></div>
            <div className="flex h-full w-[23%] rounded-xl bg-neutral-300 shadow-lg"></div>
            <div className="flex h-full w-[23%] rounded-xl bg-neutral-300 shadow-lg"></div>
          </div>
        </div>
      </div>
      {shouldRender && (
        <ChartCalenderPopper
          dateInput={dateInput}
          setDateInput={setDateInput}
          animateTrigger={animateTrigger}
          handleTransition={handleTransition}
          closeCalendar={() => {
            setIsCalendarOpen(false);
          }}
          setDefaultDateInput={setDefaultDateInput}
        />
      )}
    </div>
  );
};

export default Mystats;

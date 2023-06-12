// components
import CircleButton from "@/components/Buttons/CircleButton";
import DoughnutChart from "@/components/Charts/DoughnutChart";
import YearChart from "@/components/Charts/YearChart";
import ChartCalenderPopper from "@/components/Popper/CalendarPopper/ChartCalendarPopper";

// hooks
import { useAnimation } from "@/hooks/useAnimation";
import React, { useState } from "react";

// icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// types
import { type Dayjs } from "dayjs";

// trpc
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createInnerTRPCContext } from "@/server/api/trpc";

// routers
import { appRouter } from "@/server/api/root";
import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/server/auth";
import superjson from "superjson";

import Layout from "@/components/Layout";

// apis
import { api } from "@/utils/api";

import { type InferGetServerSidePropsType } from "next";
import dayjs from "dayjs";

// icons
import PercentageIcon from "public/icons/percentage.svg";
import BusyIcon from "public/icons/busy.svg";
import FeverIcon from "public/icons/fever.svg";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ChecklistIcon from "@mui/icons-material/Checklist";
import BulbIcon from "public/icons/bulb.svg";
import ProfitIcon from "public/icons/profit.svg";
import LossIcon from "public/icons/loss.svg";
import MoneyPlusIcon from "public/icons/money_plus.svg";
import MoneyMinusIcon from "public/icons/money_minus.svg";
import MoodIcon from "public/icons/mood.svg";
import DiaryIcon from "public/icons/diary.svg";
import MoneyAllIcon from "public/icons/money_all.svg";
import SmileIcon from "public/icons/smile.svg";
import SadIcon from "public/icons/sad.svg";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ message: "string" }>
) {
  const { req, res } = context;
  const session = await getServerAuthSession({ req, res });
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  });
  const year = new Date().getFullYear();

  const userData = await helpers.user.getUserData.fetch();
  const chartData = await helpers.daterecord.getYearlyChartData.fetch({
    dateObject: { year },
  });

  console.log(userData);

  return {
    props: {
      userData: userData.data,
      chartData,
      year,
    },
  };
}

const Mystats = ({
  userData,
  chartData,
  year,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { todos, revenues, moods } = chartData.data;
  const { preference } = userData;

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [shouldRender, animateTrigger, handleTransition] =
    useAnimation(isCalendarOpen);
  const [dateInput, setDateInput] = useState<Dayjs>(dayjs().set("year", year));
  const [todosData, setTodosData] = useState(todos.data);
  const [revenuesData, setRevenuesData] = useState(revenues.data);
  const [moodsData, setMoodsData] = useState(moods.data);
  const [todosDoughnutData, setTodosDoughnutData] = useState(todos.doughnut);
  const [revenuesDoughnutData, setRevenuesDoughnutData] = useState(
    revenues.doughnut
  );
  const [moodsDoughnutData, setMoodsDoughnutData] = useState(moods.doughnut);
  const [selectedField, setSelectedField] = useState<
    "todo" | "revenue" | "mood"
  >("todo");

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [todosCardData, setTodosCardData] = useState(todos.cards);
  const [revenuesCardData, setRevenuesCardData] = useState(revenues.cards);
  const [moodsCardData, setMoodsCardData] = useState(moods.cards);
  const [todosSummaryData, setTodosSummaryData] = useState(todos.summary);
  const [revenuesSummaryData, setRevenuesSummaryData] = useState(
    revenues.summary
  );
  const [moodsSummaryData, setMoodsSummaryData] = useState(moods.summary);

  const { isFetching } = api.daterecord.getYearlyChartData.useQuery(
    { dateObject: { year: dateInput.get("year") } },
    {
      queryKey: [
        "daterecord.getYearlyChartData",
        { dateObject: { year: dateInput.get("year") } },
      ],
      onSuccess: (res) => {
        const { todos, revenues, moods } = res.data;
        setTodosData(todos.data);
        setRevenuesData(revenues.data);
        setMoodsData(moods.data);
        setTodosDoughnutData(todos.doughnut);
        setRevenuesDoughnutData(revenues.doughnut);
        setMoodsDoughnutData(moods.doughnut);
        setTodosCardData(todos.cards);
        setRevenuesCardData(revenues.cards);
        setMoodsCardData(moods.cards);
        setTodosSummaryData(todos.summary);
        setRevenuesSummaryData(revenues.summary);
        setMoodsSummaryData(moods.summary);
      },
      enabled: !isInitialLoad,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Layout userData={userData}>
      <div className="relative flex h-full w-full flex-col px-28">
        <h1 className="text-4xl font-extrabold text-neutral-800 transition-colors dark:text-neutral-300">
          My Stats
        </h1>
        <p className="text-lg font-semibold text-neutral-700 transition-colors dark:text-neutral-200">
          See your daily life in total with monthly view in here!
        </p>
        <div className="mt-4 flex h-[80%] max-h-[600px] w-full justify-evenly rounded-xl bg-neutral-300/40 p-6 backdrop-blur-md transition-colors dark:bg-neutral-800/40">
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
                  className="foucs:border-0 relative flex h-max w-max rounded-lg bg-neutral-300 px-2 py-1 text-center text-xs font-bold text-black transition-colors hover:cursor-pointer focus:outline-blue-400 dark:bg-neutral-700 dark:text-white"
                >
                  category
                  <option value="todo">todo</option>
                  <option value="revenue">revenue</option>
                  <option value="mood">mood</option>
                </select>
              </div>
              <div className="flex w-full items-center justify-center">
                <div className="flex w-24 items-center justify-evenly">
                  <p className="rounded-xl bg-neutral-300 px-2 py-1 text-xs text-black transition-colors dark:bg-neutral-700 dark:text-white">
                    {dateInput.get("year")}
                  </p>
                  <div className="relative flex w-max">
                    <CircleButton
                      onClick={() => {
                        setIsCalendarOpen(!isCalendarOpen);
                      }}
                      className="rounded-md p-1"
                      info="select year"
                    >
                      <CalendarMonthIcon className="h-3 w-3" />
                    </CircleButton>
                    {shouldRender && (
                      <ChartCalenderPopper
                        dateInput={dateInput}
                        setDateInput={setDateInput}
                        animateTrigger={animateTrigger}
                        handleTransition={handleTransition}
                        setIsInitialLoad={setIsInitialLoad}
                        isInitialLoad={isInitialLoad}
                        closeCalendar={() => {
                          setIsCalendarOpen(false);
                        }}
                      />
                    )}
                  </div>
                  {isFetching && (
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-b-transparent border-r-transparent"></span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex h-[55%] w-full items-center justify-center rounded-xl bg-neutral-300/40 p-4 shadow-lg transition-colors dark:bg-neutral-700/80">
              <DoughnutChart
                data={
                  selectedField === "todo"
                    ? todosDoughnutData
                    : selectedField === "revenue"
                    ? revenuesDoughnutData
                    : moodsDoughnutData
                }
                isLight={preference.isLight}
              />
            </div>
            <div className="flex h-[25%] w-full flex-col items-center justify-evenly rounded-xl">
              <p className="flex h-[40%] w-full items-center rounded-md bg-neutral-400/10 px-4 py-2 text-sm font-bold text-white shadow-2xl">
                {selectedField === "mood" ? (
                  <SmileIcon className="mr-2 h-6 w-6 rounded-md bg-neutral-900/20 p-1 shadow-xl" />
                ) : (
                  <ListAltIcon className="mr-2 h-6 w-6 rounded-md bg-neutral-900/20 p-1 shadow-xl" />
                )}
                <span className="mr-2 text-xs font-semibold">
                  {selectedField === "todo"
                    ? "Total Todos"
                    : selectedField === "revenue"
                    ? "Total Count"
                    : "Good Rate"}
                </span>
                {selectedField === "todo"
                  ? todosSummaryData.completed
                  : selectedField === "revenue"
                  ? revenuesSummaryData.totalCount
                  : `${moodsSummaryData.goodRatio} %`}
              </p>
              <p className="flex h-[40%] w-full items-center rounded-md bg-neutral-400/10 px-4 py-1 text-sm font-bold text-white shadow-2xl">
                {selectedField === "todo" ? (
                  <ChecklistIcon className="mr-2 h-6 w-6 rounded-md bg-neutral-900/20 p-1 shadow-xl" />
                ) : selectedField === "revenue" ? (
                  <MoneyAllIcon className="mr-2 h-6 w-6 rounded-md bg-neutral-900/20 fill-white p-1 shadow-xl" />
                ) : (
                  <SadIcon className="mr-2 h-6 w-6 rounded-md bg-neutral-900/20 fill-white p-1 shadow-xl" />
                )}
                <span className="mr-2 text-xs font-semibold">
                  {selectedField === "todo"
                    ? "Completed"
                    : selectedField === "revenue"
                    ? "Total Revenue"
                    : "Bad Rate"}
                </span>
                {selectedField === "todo"
                  ? todosSummaryData.total
                    ? `${Math.round(
                        (todosSummaryData.completed / todosSummaryData.total) *
                          100
                      )} %`
                    : 0
                  : selectedField === "revenue"
                  ? `$ ${revenuesSummaryData.totalRevenue}`
                  : `${moodsSummaryData.badRatio} %`}
              </p>
            </div>
          </div>
          <div className="flex h-full w-[75%] flex-col justify-between px-4">
            <div className="flex h-[60%] w-full overflow-x-scroll rounded-xl bg-neutral-300/40 shadow-lg transition-colors dark:bg-neutral-700/80 lg:items-center lg:justify-center">
              <YearChart
                data={
                  selectedField === "todo"
                    ? todosData.length
                      ? todosData
                      : []
                    : selectedField === "revenue"
                    ? revenuesData.length
                      ? revenuesData
                      : []
                    : moodsData.length
                    ? moodsData
                    : []
                }
                selectedField={selectedField}
                year={dateInput.get("year")}
                isLight={preference.isLight}
              />
            </div>
            <div className="flex h-[35%] w-full justify-between">
              <div
                className={`flex h-full w-[23%] flex-col items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${
                  selectedField === "todo"
                    ? "from-pink-300 to-pink-500"
                    : selectedField === "revenue"
                    ? "from-emerald-300 to-green-500"
                    : "from-cyan-300 to-blue-500"
                }`}
              >
                <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl shadow-xl">
                  {selectedField === "todo" ? (
                    <BusyIcon className="h-8 w-8 fill-white" />
                  ) : selectedField === "revenue" ? (
                    <ProfitIcon className="h-8 w-8 fill-white" />
                  ) : (
                    <MoodIcon className="h-8 w-8 fill-white" />
                  )}
                </div>
                <p className="text-sm font-semibold text-white">
                  {selectedField === "todo"
                    ? "Most Busy Day"
                    : selectedField === "revenue"
                    ? "Most Earned Month"
                    : "Average Mood"}
                </p>
                <p className="text-md font-extrabold text-white">
                  {selectedField === "todo"
                    ? todosCardData.mostBusyDay
                      ? todosCardData.mostBusyDay
                      : "No Data"
                    : selectedField === "revenue"
                    ? revenuesCardData.mostEarnedMonth
                      ? revenuesCardData.mostEarnedMonth
                      : "No Data"
                    : moodsCardData.averageMood
                    ? moodsCardData.averageMood
                    : "No Data"}
                </p>
              </div>
              <div
                className={`flex h-full w-[23%] flex-col items-center justify-center rounded-xl bg-gradient-to-br ${
                  selectedField === "todo"
                    ? "from-red-300 to-red-500 shadow-lg"
                    : selectedField === "revenue"
                    ? "from-red-300 to-red-500"
                    : "from-purple-300 to-violet-500"
                }`}
              >
                <div className="relative mb-2 flex h-14 w-14 items-center justify-center rounded-xl shadow-xl">
                  {selectedField === "todo" ? (
                    <>
                      <BusyIcon className="h-8 w-8 fill-white" />
                      <span className="absolute bottom-0 right-2 text-[10px] font-extrabold text-white">
                        M
                      </span>
                    </>
                  ) : selectedField === "revenue" ? (
                    <LossIcon className="h-8 w-8 fill-white" />
                  ) : (
                    <DiaryIcon className="h-8 w-8 fill-white" />
                  )}
                </div>
                <p className="text-sm font-semibold text-white">
                  {selectedField === "todo"
                    ? "Most Busy Month"
                    : selectedField === "revenue"
                    ? "Most Spent Month"
                    : "Longest Kept Daylogs"}
                </p>
                <p className="text-md font-extrabold text-white">
                  {selectedField === "todo"
                    ? todosCardData.mostBusyMonth
                      ? todosCardData.mostBusyMonth
                      : "No Data"
                    : selectedField === "revenue"
                    ? revenuesCardData.mostLostMonth
                      ? revenuesCardData.mostLostMonth
                      : "No Data"
                    : moodsCardData.longestDaylogRecords}
                </p>
              </div>
              {selectedField === "mood" ? (
                <div className="relative h-full w-[46%] flex-col rounded-xl bg-neutral-400/40 p-4 shadow-lg">
                  <p className="text-xl font-extrabold text-white">
                    Did You Know ?
                  </p>
                  <p className="flex flex-col text-sm text-white">
                    <span>Jusy by tracking your moods regularly,</span>
                    <span>
                      you can ease your minds and help you feel better.
                    </span>
                  </p>
                  <p className="mt-3 flex flex-col text-xs text-neutral-800">
                    <span>If you struggle with your feelings,</span>
                    <span>get reach for someone to help you</span>
                  </p>
                  <a
                    className="absolute bottom-5 w-max text-xs font-bold text-cyan-400"
                    href="https://en.wikipedia.org/wiki/List_of_suicide_crisis_lines"
                  >
                    Lists of World Crisis Hotlines
                  </a>
                  <div className="absolute bottom-2 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <BulbIcon className="h-10 w-10" />
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`flex h-full w-[23%] flex-col items-center justify-center rounded-xl bg-gradient-to-br ${
                      selectedField === "todo"
                        ? "from-cyan-300 to-blue-500 shadow-lg"
                        : selectedField === "revenue"
                        ? "from-blue-300 to-indigo-500"
                        : "from-purple-300 to-violet-500"
                    }`}
                  >
                    <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl shadow-xl">
                      {selectedField === "todo" ? (
                        <PercentageIcon className="h-6 w-6 fill-white" />
                      ) : (
                        <MoneyPlusIcon className="h-8 w-8 fill-white" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {selectedField === "todo"
                        ? "Average Complete Ratio"
                        : "Highest Profit"}
                    </p>
                    <p className="text-lg font-extrabold text-white">
                      {selectedField === "todo"
                        ? `${todosCardData.averageCompleteRatio} %`
                        : `$ ${revenuesCardData.highestProfit}`}
                    </p>
                  </div>
                  <div
                    className={`flex h-full w-[23%] flex-col items-center justify-center rounded-xl bg-gradient-to-br ${
                      selectedField === "todo"
                        ? "from-lime-300 to-emerald-500 shadow-lg"
                        : "from-red-300 to-red-500"
                    }`}
                  >
                    <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl shadow-xl">
                      {selectedField === "todo" ? (
                        <FeverIcon className="h-8 w-8 fill-lime-500" />
                      ) : (
                        <MoneyMinusIcon className="h-8 w-8 fill-white" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {selectedField === "todo"
                        ? "All-Clear Combos"
                        : "Highest Spent"}
                    </p>
                    <p className="text-md font-extrabold text-white">
                      {selectedField === "todo"
                        ? todosCardData.longestCombo
                        : revenuesCardData.highestLoss}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Mystats;

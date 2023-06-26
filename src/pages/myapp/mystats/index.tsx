// components
import CircleButton from "@/components/Buttons/CircleButton";
import DoughnutChart from "@/components/Charts/DoughnutChart";
import YearChart from "@/components/Charts/YearChart";
import ChartCalenderPopper from "@/components/Popper/CalendarPopper/ChartCalendarPopper";
import Select from "@/components/Select/Select";

// hooks
import { useAnimation } from "@/hooks/useAnimation";
import React, { useEffect, useState } from "react";

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
import { motion, useAnimate, stagger } from "framer-motion";

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

  const [scope, animate] = useAnimate();

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

  useEffect(() => {
    animate(
      ".stat-item",
      { y: [20, 0], opacity: [0, 1] },
      { delay: stagger(0.05, { startDelay: 0.05 }) }
    )
      .then(() => {
        return;
      })
      .catch(() => {
        return;
      });
  }, [selectedField]);

  return (
    <Layout userData={userData}>
      <div className="relative flex h-[90%] max-h-[900px] min-h-[500px] w-full max-w-[1700px] flex-col items-center px-4 lg:min-h-[700px] lg:px-28">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-2 flex h-[7%] w-full flex-col items-center sm:items-start"
        >
          <h1 className="text-4xl font-extrabold text-neutral-800 transition-colors dark:text-neutral-300 lg:text-4xl">
            My Stats
          </h1>
          <p className="text-xs font-semibold text-neutral-700 transition-colors dark:text-neutral-200 lg:text-lg">
            See your daily life in total with monthly view
          </p>
        </motion.div>
        <motion.div
          ref={scope}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.3,
          }}
          className="mt-4 flex h-[85%] w-full flex-col items-start overflow-scroll rounded-xl bg-neutral-300/40 p-6 backdrop-blur-lg transition-colors dark:bg-neutral-800/40 lg:h-[80%] lg:flex-row lg:justify-evenly lg:overflow-visible"
        >
          <div className="relative flex h-full w-full flex-col justify-between rounded-xl lg:w-[20%] lg:justify-evenly">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex h-[12%] w-max flex-row items-center justify-evenly lg:w-full lg:flex-col lg:justify-between"
            >
              <div className="flex w-full items-center justify-evenly lg:w-[50%]">
                <Select
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setSelectedField(
                      e.currentTarget.value as "todo" | "revenue" | "mood"
                    );
                  }}
                  value={selectedField}
                  className="relative flex h-6 w-[90px] rounded-lg bg-neutral-300 text-center text-[8px] font-bold text-black transition-colors hover:cursor-pointer focus:border-0 focus:outline-blue-400 dark:bg-neutral-700 dark:fill-neutral-200 dark:text-white mobile:text-xs"
                >
                  <>
                    <option value="todo">todo</option>
                    <option value="revenue">revenue</option>
                    <option value="mood">mood</option>
                  </>
                </Select>
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
                      className="rounded-lg p-1"
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
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex h-[200px] w-full flex-row lg:h-[80%] lg:flex-col"
            >
              <div className="stat-item mt-2 flex h-full w-1/2 items-center justify-center rounded-xl bg-neutral-300/40 p-4 shadow-lg transition-colors dark:bg-neutral-700/80 lg:mt-0  lg:h-[70%] lg:w-full">
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
              <div className="mt-2 flex h-full w-1/2 flex-col items-center justify-evenly rounded-xl px-4 lg:mt-0 lg:h-[25%] lg:w-full lg:px-0">
                <p className="stat-item flex h-[45%] w-full flex-col items-center justify-evenly rounded-lg bg-neutral-400/10 px-4 py-2 text-xs font-bold text-white shadow-2xl lg:h-[40%] lg:flex-row lg:justify-start lg:text-sm">
                  {selectedField === "mood" ? (
                    <SmileIcon className="mr-0 h-6 w-6 rounded-lg bg-neutral-900/20 p-1 shadow-xl lg:mr-2" />
                  ) : (
                    <ListAltIcon className="mr-0 h-6 w-6 rounded-lg bg-neutral-900/20 p-1 shadow-xl lg:mr-2" />
                  )}
                  <span className="mr-0 text-[8px] font-semibold mobile:text-xs md:text-sm lg:mr-2">
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
                <p className="stat-item flex h-[45%] w-full flex-col items-center justify-evenly rounded-lg bg-neutral-400/10 px-4 py-1 text-xs font-bold text-white shadow-2xl lg:h-[40%] lg:flex-row lg:justify-start lg:text-sm">
                  {selectedField === "todo" ? (
                    <ChecklistIcon className="mr-0 h-6 w-6 rounded-lg bg-neutral-900/20 p-1 shadow-xl lg:mr-2" />
                  ) : selectedField === "revenue" ? (
                    <MoneyAllIcon className="mr-0 h-6 w-6 rounded-lg bg-neutral-900/20 fill-white p-1 shadow-xl lg:mr-2" />
                  ) : (
                    <SadIcon className="mr-0 h-6 w-6 rounded-lg bg-neutral-900/20 fill-white p-1 shadow-xl lg:mr-2" />
                  )}
                  <span className="mr-0 text-[8px] font-semibold mobile:text-xs md:text-sm lg:mr-2 ">
                    {selectedField === "todo"
                      ? "Completed"
                      : selectedField === "revenue"
                      ? "Total Revenue"
                      : "Bad Rate"}
                  </span>
                  {selectedField === "todo"
                    ? todosSummaryData.total
                      ? `${Math.round(
                          (todosSummaryData.completed /
                            todosSummaryData.total) *
                            100
                        )} %`
                      : 0
                    : selectedField === "revenue"
                    ? `$ ${revenuesSummaryData.totalRevenue}`
                    : `${moodsSummaryData.badRatio} %`}
                </p>
              </div>
            </motion.div>
          </div>
          <div className="flex h-max w-full flex-col-reverse justify-between lg:h-full lg:w-[75%] lg:flex-col lg:px-4">
            <div className="stat-item flex h-[300px] w-full overflow-x-scroll rounded-xl bg-neutral-300/40 shadow-lg transition-colors dark:bg-neutral-700/80 lg:h-[60%] lg:items-center lg:justify-center">
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
            <div className="my-2 flex h-[30%] w-full justify-between lg:my-0 lg:h-[35%]">
              <div
                className={`stat-item flex h-full w-[23%] flex-col items-center justify-center rounded-xl bg-transparent lg:h-full lg:w-[23%] lg:bg-gradient-to-br lg:shadow-lg ${
                  selectedField === "todo"
                    ? "from-pink-300 to-pink-500"
                    : selectedField === "revenue"
                    ? "from-emerald-300 to-green-500"
                    : "from-cyan-300 to-blue-500"
                }`}
              >
                <div
                  className={`mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br lg:h-14 lg:w-14 lg:bg-transparent lg:shadow-xl ${
                    selectedField === "todo"
                      ? "from-pink-300 to-pink-500"
                      : selectedField === "revenue"
                      ? "from-emerald-300 to-green-500"
                      : "from-cyan-300 to-blue-500"
                  }`}
                >
                  {selectedField === "todo" ? (
                    <BusyIcon className="h-8 w-8 fill-white" />
                  ) : selectedField === "revenue" ? (
                    <ProfitIcon className="h-8 w-8 fill-white" />
                  ) : (
                    <MoodIcon className="h-8 w-8 fill-white" />
                  )}
                </div>
                <p className="hidden text-[8px] font-medium text-white mobile:text-xs md:block lg:text-[12px] lg:font-semibold xl:text-[13px]">
                  {selectedField === "todo"
                    ? "Most Busy Day"
                    : selectedField === "revenue"
                    ? "Most Earned Month"
                    : "Average Mood"}
                </p>
                <p className="text-[8px] font-extrabold text-white mobile:text-xs lg:text-[12px] xl:text-[13px]">
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
                className={`stat-item flex h-full w-[23%] flex-col items-center justify-center rounded-xl bg-transparent lg:bg-gradient-to-br lg:shadow-lg ${
                  selectedField === "todo"
                    ? "from-red-300 to-red-500"
                    : selectedField === "revenue"
                    ? "from-red-300 to-red-500"
                    : "from-purple-300 to-violet-500"
                }`}
              >
                <div
                  className={`relative mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br lg:shadow-xl ${
                    selectedField === "todo"
                      ? "from-red-300 to-red-500"
                      : selectedField === "revenue"
                      ? "from-red-300 to-red-500"
                      : "from-purple-300 to-violet-500"
                  }`}
                >
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
                <p className="hidden text-[8px] font-semibold text-white mobile:text-xs md:block lg:text-[12px] xl:text-[13px]">
                  {selectedField === "todo"
                    ? "Most Busy Month"
                    : selectedField === "revenue"
                    ? "Most Spent Month"
                    : "Longest Kept Daylogs"}
                </p>
                <p className="text-[8px] font-extrabold text-white mobile:text-xs lg:block lg:text-[12px] xl:text-[13px]">
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
                <div className="stat-item relative h-full w-[46%] flex-col rounded-xl bg-neutral-400/40 p-4 shadow-lg">
                  <p className="text-[8px] font-extrabold text-white mobile:text-xs lg:text-xl">
                    Did You Know ?
                  </p>
                  <p className="flex flex-col text-[8px] text-white mobile:text-xs lg:text-sm xl:text-[13px]">
                    <span>Jusy by tracking your moods regularly,</span>
                    <span>
                      you can ease your minds and help you feel better.
                    </span>
                  </p>
                  <div className="flex flex-col">
                    <p className="mt-2 hidden flex-col text-[8px] text-neutral-800 mobile:text-xs sm:flex lg:mt-4 lg:text-sm">
                      <span>If you struggle with your feelings,</span>
                      <span>get reach for someone to help you</span>
                    </p>
                    <a
                      className="mt-1 hidden w-max font-bold text-cyan-400 sm:block sm:text-xs"
                      href="https://en.wikipedia.org/wiki/List_of_suicide_crisis_lines"
                    >
                      Lists of World Crisis Hotlines
                    </a>
                  </div>
                  <div className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white mobile:top-2 mobile:h-8 mobile:w-8 lg:bottom-2 lg:right-4 lg:h-12 lg:w-12">
                    <BulbIcon className="h-4 w-4 mobile:h-6 mobile:w-6 lg:h-10 lg:w-10" />
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`stat-item flex h-full w-[23%] flex-col items-center justify-center rounded-xl bg-transparent lg:bg-gradient-to-br lg:shadow-lg ${
                      selectedField === "todo"
                        ? "from-cyan-300 to-blue-500"
                        : selectedField === "revenue"
                        ? "from-blue-300 to-indigo-500"
                        : "from-purple-300 to-violet-500"
                    }`}
                  >
                    <div
                      className={`mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br lg:bg-transparent lg:shadow-xl ${
                        selectedField === "todo"
                          ? "from-cyan-300 to-blue-500"
                          : selectedField === "revenue"
                          ? "from-blue-300 to-indigo-500"
                          : "from-purple-300 to-violet-500"
                      }`}
                    >
                      {selectedField === "todo" ? (
                        <PercentageIcon className="h-6 w-6 fill-white" />
                      ) : (
                        <MoneyPlusIcon className="h-8 w-8 fill-white" />
                      )}
                    </div>
                    <p className="hidden text-[8px] font-semibold text-white mobile:text-xs md:block xl:text-[13px]">
                      {selectedField === "todo"
                        ? "Average Complete Ratio"
                        : "Highest Profit"}
                    </p>
                    <p className="text-[8px] font-extrabold text-white mobile:text-xs lg:block xl:text-[13px]">
                      {selectedField === "todo"
                        ? `${todosCardData.averageCompleteRatio} %`
                        : `$ ${revenuesCardData.highestProfit}`}
                    </p>
                  </div>
                  <div
                    className={`stat-item flex h-full w-[23%] flex-col items-center justify-center rounded-xl bg-transparent lg:bg-gradient-to-br lg:shadow-lg ${
                      selectedField === "todo"
                        ? "from-lime-300 to-emerald-500"
                        : "from-red-300 to-red-500"
                    }`}
                  >
                    <div
                      className={`mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br lg:bg-transparent lg:shadow-xl ${
                        selectedField === "todo"
                          ? "from-lime-300 to-emerald-500"
                          : "from-red-300 to-red-500"
                      }`}
                    >
                      {selectedField === "todo" ? (
                        <FeverIcon className="h-8 w-8 fill-lime-500" />
                      ) : (
                        <MoneyMinusIcon className="h-8 w-8 fill-white" />
                      )}
                    </div>
                    <p className="hidden text-[8px] font-semibold text-white mobile:text-xs md:block xl:text-[13px]">
                      {selectedField === "todo"
                        ? "All-Clear Combos"
                        : "Highest Spent"}
                    </p>
                    <p className="text-[8px] font-extrabold text-white mobile:text-xs lg:block lg:text-[12px] xl:text-[13px]">
                      {selectedField === "todo"
                        ? todosCardData.longestCombo
                        : `$ ${revenuesCardData.highestLoss}`}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Mystats;

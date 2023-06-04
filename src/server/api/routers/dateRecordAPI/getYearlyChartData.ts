import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// verify
import tokenVerify from "@/server/api/routers/auth/tokenVerify";

const dateFormatter = (year: number, month: number, date: number) => {
  return `${year}-${month < 10 ? "0" + String(month) : month}-${
    date < 10 ? "0" + String(date) : date
  }`;
};

const getYearlyChartData = protectedProcedure
  .input(
    z.optional(
      z.object({
        dateObject: z.object({
          year: z.number(),
        }),
      })
    )
  )
  .query(async ({ ctx, input }) => {
    const session = ctx.session;
    const { id: userId } = session.user;

    if (!tokenVerify(session)) {
      throw new TRPCError({ message: "TOKEN ERROR", code: "UNAUTHORIZED" });
    }

    const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new TRPCError({ message: "BAD_REQUEST", code: "BAD_REQUEST" });
    }

    const queryYearlyData = async (year?: number) => {
      try {
        if (!year) year = new Date().getFullYear();
        console.log(year);
        const yearlyDateRecordsdata = await ctx.prisma.dateRecord.findMany({
          where: {
            userId,
            year,
          },
          include: {
            todos: {
              select: {
                completed: true,
              },
            },
            daylogs: {
              select: {
                mood: true,
              },
            },
            revenues: {
              select: {
                revenue: true,
              },
            },
          },
        });

        if (yearlyDateRecordsdata.length) {
          const monthsArray = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];

          // yearly todos query
          const todosMonthlyCounthMap = new Map<number, number>();
          let todosCountPerDay = 0;
          let mostBusyDay = "";
          let yearlyTotalTodos = 0;
          let yearlyTotalCompletedTodos = 0;
          let currentCombo = 0;
          let longestCombo = 0;
          let sumOfTodosCompleteRatio = 0;

          const yearlyTodosArray = yearlyDateRecordsdata
            .map((data) => {
              const day = dateFormatter(data.year, data.month, data.date);
              const value = data.todos.length;
              const completed = data.todos.reduce((acc, cur) => {
                if (cur.completed) {
                  return acc + 1;
                } else {
                  return acc;
                }
              }, 0);

              if (data.todos.length) {
                // most busy month calc
                const currentMonthData = todosMonthlyCounthMap.get(data.month);
                if (currentMonthData)
                  todosMonthlyCounthMap.set(
                    data.month,
                    currentMonthData + value
                  );
                else {
                  todosMonthlyCounthMap.set(data.month, value);
                }

                // most busy day calc
                if (data.todos.length > todosCountPerDay) {
                  todosCountPerDay = data.todos.length;
                  mostBusyDay = day;
                }
              }

              return { day, value, completed };
            })
            .filter((data) => data.value > 0);

          yearlyTodosArray.forEach((data) => {
            if (data.completed) yearlyTotalCompletedTodos += data.completed;
            yearlyTotalTodos += data.value;
            const completeRatio = Math.round(
              (data.completed / data.value) * 100
            );
            if (completeRatio === 100) {
              currentCombo++;
              longestCombo = Math.max(currentCombo, longestCombo);
            }
            sumOfTodosCompleteRatio += completeRatio;
          });

          const mostBusyMonth = [...todosMonthlyCounthMap.entries()].reduce(
            (acc, cur) => (cur[1] > acc[1] ? [...cur] : [...acc])
          )[0];

          const yearlyTodosData = {
            data: yearlyTodosArray,
            doughnut: [
              {
                id: "not yet",
                label: "not yet",
                value: yearlyTotalTodos - yearlyTotalCompletedTodos,
              },
              {
                id: "completed",
                label: "completed",
                value: yearlyTotalCompletedTodos,
              },
            ],
            summary: {
              total: yearlyTotalTodos,
              completed: yearlyTotalCompletedTodos,
            },
            cards: {
              mostBusyDay: mostBusyDay,
              longestCombo,
              mostBusyMonth: mostBusyMonth
                ? `${year} ${monthsArray[mostBusyMonth - 1] as string}`
                : undefined,
              averageCompleteRatio: Math.floor(
                sumOfTodosCompleteRatio / yearlyTotalTodos
              ),
            },
          };

          // yearly revenues query
          const revenuesMonthlyCounthMap = new Map<number, number>();

          let yearlyTotalLoss = 0;
          let yearlyTotalProfit = 0;
          let yearlyTotalCount = 0;
          let highestProfit = 0;
          let highestLoss = 0;

          const yearlyRevenuesArray = yearlyDateRecordsdata
            .map((data) => {
              const day = dateFormatter(data.year, data.month, data.date);
              const totalCount = data.revenues.length;
              const earnCount = data.revenues.reduce((acc, cur) => {
                if (Number(cur.revenue) > 0) {
                  return acc + 1;
                } else {
                  return acc;
                }
              }, 0);
              const totalRevenue = data.revenues.reduce(
                (acc, cur) => acc + Number(cur.revenue),
                0
              );

              if (totalCount) {
                const currentMonthData = revenuesMonthlyCounthMap.get(
                  data.month
                );
                if (currentMonthData)
                  revenuesMonthlyCounthMap.set(
                    data.month,
                    currentMonthData + totalRevenue
                  );
                else {
                  revenuesMonthlyCounthMap.set(data.month, totalRevenue);
                }
              }

              return { day, totalCount, earnCount, value: totalRevenue };
            })
            .filter((data) => data.value !== 0);

          const mostEarnedMonth = [
            ...revenuesMonthlyCounthMap.entries(),
          ].reduce((acc, cur) => (cur[1] > acc[1] ? [...cur] : [...acc]))[0];

          const mostLostMonth = [...revenuesMonthlyCounthMap.entries()].reduce(
            (acc, cur) => (cur[1] < acc[1] ? [...cur] : [...acc])
          )[0];

          yearlyRevenuesArray.forEach((data) => {
            if (data.value > 0) {
              yearlyTotalProfit += data.value;
              highestProfit = Math.max(highestProfit, data.value);
            }
            if (data.value < 0) {
              yearlyTotalLoss += data.value;
              highestLoss = Math.min(highestLoss, data.value);
            }

            yearlyTotalCount++;
          });

          const yearlyRevenuesData = {
            data: yearlyRevenuesArray,
            doughnut: [
              { id: "profit", label: "profit", value: yearlyTotalProfit },
              { id: "loss", label: "loss", value: Math.abs(yearlyTotalLoss) },
            ],
            summary: {
              totalCount: yearlyTotalCount,
              totalRevenue: yearlyTotalProfit + yearlyTotalLoss,
            },
            cards: {
              mostEarnedMonth: mostEarnedMonth
                ? `${year} ${monthsArray[mostEarnedMonth - 1] as string}`
                : undefined,
              mostLostMonth: mostLostMonth
                ? `${year} ${monthsArray[mostLostMonth - 1] as string}`
                : undefined,
              highestProfit,
              highestLoss,
            },
          };

          // yearly moods (daylog) query
          // terrible: 0, bad: 1, normal: 2, good: 3, happy: 4
          let longestDaylogRecords = 0;
          let currentDaylogRecords = 0;

          const yearlyMoodsArray = yearlyDateRecordsdata
            .map((data) => {
              const day = dateFormatter(data.year, data.month, data.date);
              if (data.daylogs) {
                currentDaylogRecords++;
                longestDaylogRecords = Math.max(
                  currentDaylogRecords,
                  longestDaylogRecords
                );
                const mood =
                  data.daylogs.mood === "terrible"
                    ? 1
                    : data.daylogs.mood === "bad"
                    ? 2
                    : data.daylogs.mood === "normal"
                    ? 3
                    : data.daylogs.mood === "good"
                    ? 4
                    : 5;

                return { day, value: mood };
              } else {
                currentDaylogRecords = 0;
                return null;
              }
            })
            .filter((element) => element) as {
            day: string;
            value: number;
          }[];

          const moodCount = [0, 0, 0, 0, 0];
          const moodsArray = ["terrible", "bad", "normal", "good", "happy"];

          yearlyMoodsArray.forEach((data) => {
            if (data.value) {
              switch (data.value) {
                case 1:
                  moodCount[0]++;
                  break;
                case 2:
                  moodCount[1]++;
                  break;
                case 3:
                  moodCount[2]++;
                  break;
                case 4:
                  moodCount[3]++;
                  break;
                case 5:
                  moodCount[4]++;
                  break;

                default:
                  throw new TRPCError({
                    message: "SERVER ERROR, WRONG VALUE",
                    code: "INTERNAL_SERVER_ERROR",
                  });
              }
            }
          });

          const averageMood = Math.round(
            moodCount.reduce((acc, cur, index) => acc + (cur * index + 1), 0) /
              5
          );

          const goodRatio = Math.round(
            (((moodCount[3] as number) + (moodCount[4] as number)) /
              yearlyMoodsArray.length) *
              100
          );
          const badRatio = Math.round(
            (((moodCount[0] as number) + (moodCount[1] as number)) /
              yearlyMoodsArray.length) *
              100
          );

          const yearlyMoodsData = {
            data: yearlyMoodsArray,
            doughnut: [
              {
                id: "terrible",
                label: "terrible",
                value: moodCount[0] as number,
              },
              { id: "bad", label: "bad", value: moodCount[1] as number },
              { id: "normal", label: "normal", value: moodCount[2] as number },
              { id: "good", label: "good", value: moodCount[3] as number },
              { id: "happy", label: "happy", value: moodCount[4] as number },
            ].filter((data) => data.value),
            summary: {
              goodRatio,
              badRatio,
            },
            cards: {
              averageMood: averageMood ? moodsArray[averageMood] : undefined,
              longestDaylogRecords,
            },
          };

          return { yearlyTodosData, yearlyRevenuesData, yearlyMoodsData };
        } else {
          return {
            yearlyTodosData: {
              data: [],
              doughnut: [],
              summary: {
                total: 0,
                completed: 0,
              },
              cards: {
                mostBusyDay: undefined,
                longestCombo: 0,
                mostBusyMonth: undefined,
                averageCompleteRatio: 0,
              },
            },
            yearlyRevenuesData: {
              data: [],
              doughnut: [],
              summary: {
                totalCount: 0,
                totalRevenue: 0,
              },
              cards: {
                mostEarnedMonth: undefined,
                mostLostMonth: undefined,
                highestProfit: 0,
                highestLoss: 0,
              },
            },
            yearlyMoodsData: {
              data: [],
              doughnut: [],
              summary: {
                goodRatio: 0,
                badRatio: 0,
              },
              cards: {
                averageMood: undefined,
                longestDaylogRecords: 0,
              },
            },
          };
        }
      } catch (err) {
        throw new TRPCError({
          message: "QUERY FAILED",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    };

    if (input) {
      const {
        yearlyTodosData: todos,
        yearlyRevenuesData: revenues,
        yearlyMoodsData: moods,
      } = await queryYearlyData(input.dateObject.year);
      return {
        data: {
          todos,
          revenues,
          moods,
        },
      };
    } else {
      const {
        yearlyTodosData: todos,
        yearlyRevenuesData: revenues,
        yearlyMoodsData: moods,
      } = await queryYearlyData();
      return {
        data: {
          todos,
          revenues,
          moods,
        },
      };
    }
  });

export default getYearlyChartData;

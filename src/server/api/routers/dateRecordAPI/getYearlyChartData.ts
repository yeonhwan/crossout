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

        // yearly todos query
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
            return { day, value, completed };
          })
          .filter((data) => data.value > 0);

        let yearlyTotalTodos = 0;
        let yearlyTotalCompletedTodos = 0;

        yearlyTodosArray.forEach((data) => {
          if (data.completed) yearlyTotalCompletedTodos += data.completed;
          yearlyTotalTodos += data.value;
        });

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
          total: yearlyTotalTodos,
          completed: yearlyTotalCompletedTodos,
        };

        // yearly revenues query
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
            return { day, totalCount, earnCount, value: totalRevenue };
          })
          .filter((data) => data.value > 0);

        let yearlyTotalLoss = 0;
        let yearlyTotalProfit = 0;
        let yearlyTotalCount = 0;
        let yearlyTotalProfitCount = 0;

        yearlyRevenuesArray.forEach((data) => {
          if (data.value > 0) {
            yearlyTotalProfit += data.value;
            yearlyTotalProfitCount++;
          }
          if (data.value < 0) yearlyTotalLoss += data.value;

          yearlyTotalCount++;
        });

        const yearlyRevenuesData = {
          data: yearlyRevenuesArray,
          totalCount: yearlyTotalCount,
          totalRevenue: yearlyTotalProfit + yearlyTotalLoss,
          totalProfitCount: yearlyTotalProfitCount,
          totalLossCount: yearlyTotalCount - yearlyTotalProfitCount,
          doughnut: [
            { id: "profit", label: "profit", value: yearlyTotalProfit },
            { id: "loss", label: "loss", value: Math.abs(yearlyTotalLoss) },
          ],
        };

        // yearly moods (daylog) query
        // terrible: 0, bad: 1, normal: 2, good: 3, happy: 4
        const yearlyMoodsArray = yearlyDateRecordsdata
          .map((data) => {
            const day = dateFormatter(data.year, data.month, data.date);
            if (data.daylogs) {
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
              return null;
            }
          })
          .filter((element) => element) as {
          day: string;
          value: number;
        }[];

        const moodCount = [0, 0, 0, 0, 0];
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
          ],
        };

        return { yearlyTodosData, yearlyRevenuesData, yearlyMoodsData };
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

import { createTRPCRouter } from "@/server/api/trpc";

// API
import getMonthlyData from "@/server/api/routers/dateRecordAPI/getMonthlyData";
import getYearlyChartData from "@/server/api/routers/dateRecordAPI/getYearlyChartData";

export const dateRecordRouter = createTRPCRouter({
  getMonthlyData,
  getYearlyChartData,
});

export type DateRecordRouter = typeof dateRecordRouter;

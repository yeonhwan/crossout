import { createTRPCRouter } from "@/server/api/trpc";

// API
import getDateRecordId from "@/server/api/routers/dateRecordAPI/getDateRecordId";
import getMonthlyData from "@/server/api/routers/dateRecordAPI/getMonthlyData";
import getYearlyChartData from "@/server/api/routers/dateRecordAPI/getYearlyChartData";

export const dateRecordRouter = createTRPCRouter({
  getDateRecordId,
  getMonthlyData,
  getYearlyChartData,
});

export type DateRecordRouter = typeof dateRecordRouter;

import { createTRPCRouter } from "@/server/api/trpc";

// API
import getDateRecordId from "@/server/api/routers/dateRecordAPI/getDateRecordId";
import getMonthlyData from "@/server/api/routers/dateRecordAPI/getMonthlyData";

export const dateRecordRouter = createTRPCRouter({
  getDateRecordId,
  getMonthlyData,
});

import { createTRPCRouter } from "@/server/api/trpc";

// API
import getDateRecordId from "@/server/api/routers/dateRecordAPI/getDateRecordId";

export const dateRecordRouter = createTRPCRouter({
  getDateRecordId,
});

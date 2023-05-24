import { createTRPCRouter } from "@/server/api/trpc";

// API
import getRevenues from "@/server/api/routers/revenueAPI/getRevenues";
import createRevenue from "@/server/api/routers/revenueAPI/createRevenue";
import updateRevenue from "@/server/api/routers/revenueAPI/updateRevenue";
import deleteRevenue from "@/server/api/routers/revenueAPI/deleteRevenue";

export const revenueRouter = createTRPCRouter({
  getRevenues,
  createRevenue,
  updateRevenue,
  deleteRevenue,
});

import { createTRPCRouter } from "@/server/api/trpc";

// API
import getListboards from "./listboardsAPI/getListboards";
import createListboard from "./listboardsAPI/createListboard";

export const listboardsRouter = createTRPCRouter({
  getListboards,
  createListboard,
});

import { createTRPCRouter } from "@/server/api/trpc";

// API
import getListboards from "@/server/api/routers/listboardsAPI/getListboards";
import createListboard from "@/server/api/routers/listboardsAPI/createListboard";
import updateListboard from "@/server/api/routers/listboardsAPI/updateListboard";
import deleteListboard from "@/server/api/routers/listboardsAPI/deleteListboard";

export const listboardsRouter = createTRPCRouter({
  getListboards,
  createListboard,
  updateListboard,
  deleteListboard,
});

export type ListboardRouter = typeof listboardsRouter;

import { createTRPCRouter } from "@/server/api/trpc";

// API
import getListboards from "./listboardsAPI/getListboards";
import createListboard from "./listboardsAPI/createListboard";
import updateListboard from "./listboardsAPI/updateListboard";
import deleteListboard from "./listboardsAPI/deleteListboard";

export const listboardsRouter = createTRPCRouter({
  getListboards,
  createListboard,
  updateListboard,
  deleteListboard,
});

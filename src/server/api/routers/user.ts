import { createTRPCRouter } from "@/server/api/trpc";
import getUserData from "./userAPI/getUserData";
import setUserPreference from "./userAPI/setUserPreference";
import setUsername from "@/server/api/routers/userAPI/setUsername";
import deleteUser from "./userAPI/deleteUser";

export const userRouter = createTRPCRouter({
  getUserData,
  setUserPreference,
  setUsername,
  deleteUser,
});

export type UserRouter = typeof userRouter;

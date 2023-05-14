import { createTRPCRouter } from "@/server/api/trpc";

// API
import getTodos from "@/server/api/routers/todoAPI/getTodos";
import createTodo from "./todoAPI/createTodo";

export const todoRouter = createTRPCRouter({
  createTodo,
  getTodos,
});

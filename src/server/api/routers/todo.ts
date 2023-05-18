import { createTRPCRouter } from "@/server/api/trpc";

// API
import getTodos from "@/server/api/routers/todoAPI/getTodos";
import createTodo from "@/server/api/routers/todoAPI/createTodo";
import updateTodo from "@/server/api/routers/todoAPI/updateTodo";
import updateTodoIndex from "@/server/api/routers/todoAPI/updateTodoIndex";
import deleteTodo from "@/server/api/routers/todoAPI/deleteTodo";
import completeTodo from "@/server/api/routers/todoAPI/completeTodo";

export const todoRouter = createTRPCRouter({
  createTodo,
  getTodos,
  updateTodo,
  updateTodoIndex,
  deleteTodo,
  completeTodo,
});

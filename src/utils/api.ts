/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "@/server/api/root";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs             = inferRouterInputs<AppRouter>;
export type TodoCreateInput          = RouterInputs["todo"]["createTodo"];
export type GetTodoInput             = RouterInputs["todo"]["getTodos"];
export type DeleteTodoInput          = RouterInputs["todo"]["deleteTodo"];
export type UpdateTodoInput          = RouterInputs["todo"]["updateTodo"];
export type CompleteTodoInput        = RouterInputs["todo"]["completeTodo"];
export type UpdateTodoIndexInput     = RouterInputs["todo"]["updateTodoIndex"];
export type GetListboardsInput       = RouterInputs["listboards"]["getListboards"];
export type CreateListboardInput     = RouterInputs["listboards"]["createListboard"];
export type UpdateListboardInput     = RouterInputs["listboards"]["updateListboard"];
export type DeleteListboardInput     = RouterInputs["listboards"]["deleteListboard"];
export type UpsertEditorContentInput = RouterInputs["daylog"]["upsertEditorContent"];
export type UpsertDaylogInput        = RouterInputs["daylog"]["upsertDaylog"];
export type CreateRevenueInput       = RouterInputs["revenue"]["createRevenue"];
export type GetRevenuesInput         = RouterInputs["revenue"]["getRevenues"];
export type UpdateRevenueInput       = RouterInputs["revenue"]["updateRevenue"];
export type DeleteRevenueInput       = RouterInputs["revenue"]["deleteRevenue"];
export type GetMonthlydataInput      = RouterInputs["daterecord"]["getMonthlyData"];
export type GetYearlyChartDataInput  = RouterInputs["daterecord"]["getYearlyChartData"];
export type SetUserPreferenceInput   = RouterInputs["user"]["setUserPreference"];
export type SetUsernameInput         = RouterInputs["user"]["setUsername"];


/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs             = inferRouterOutputs<AppRouter>;
export type GetTodoOutput             = RouterOutputs["todo"]["getTodos"];
export type UpdateTodoOutput          = RouterOutputs["todo"]["updateTodo"];
export type DeleteTodoOutput          = RouterOutputs["todo"]["deleteTodo"];
export type CompleteTodoOutput        = RouterOutputs["todo"]["completeTodo"];
export type UpdateTodoIndexOutput     = RouterOutputs["todo"]["updateTodoIndex"];
export type GetListboardsOutput       = RouterOutputs["listboards"]["getListboards"];
export type CreateListboardOutput     = RouterOutputs["listboards"]["createListboard"];
export type UpdateListboardOutput     = RouterOutputs["listboards"]["updateListboard"];
export type DeleteListboardOutput     = RouterOutputs["listboards"]["deleteListboard"];
export type GetDayLogOutput           = RouterOutputs["daylog"]["getDaylog"];
export type UpsertDaylogOutput        = RouterOutputs["daylog"]["upsertDaylog"];
export type UpsertEditorContentOutput = RouterOutputs["daylog"]["upsertEditorContent"];
export type CreateRevenueOutput       = RouterOutputs["revenue"]["createRevenue"];
export type GetRevenuesOutput         = RouterOutputs["revenue"]["getRevenues"];
export type UpdateRevenueOutput       = RouterOutputs["revenue"]["updateRevenue"];
export type DeleteRevenueOutput       = RouterOutputs["revenue"]["deleteRevenue"];
export type GetMonthlydataOutput      = RouterOutputs["daterecord"]["getMonthlyData"];
export type GetYearlyChartDataOutput  = RouterOutputs["daterecord"]["getYearlyChartData"];
export type GetUserPreferenceOutput   = RouterOutputs["user"]["getUserData"];
export type SetUserPreferenceOutput   = RouterOutputs["user"]["setUserPreference"];
export type SetUsernameOutput         = RouterOutputs["user"]["setUsername"];
export type DeleteUserOutput          = RouterOutputs["user"]["deleteUser"];
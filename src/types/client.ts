import {
  type ListBoard,
  type Todo,
  type Revenue,
  type Mood,
} from "@prisma/client";
import { type Prisma } from "@prisma/client";

// items

export type TodoWithListboardType = Todo & { listBoard: ListBoard | null };

export type ListboardItemType = ListBoard & {
  todos: TodoWithListboardType[];
};

export type UpdateTodoIndexDataType = {
  data: { dateRecordId: number; index: number[] };
};

export type RevenueClient = Omit<Revenue, "revenue"> & {
  revenue: number;
};

// Calendar
export type MonthlyRevenuesData = {
  date: number;
  revenues: {
    revenue: number;
    purpose: string;
  }[];
}[];

export type MonthlyTodosData = {
  date: number;
  todos: {
    content: string;
    completed: boolean;
  }[];
  _count: {
    todos: number;
  };
}[];

export type MonthlyDaylogData = {
  date: number;
  daylogs: {
    content: Prisma.JsonValue;
    mood: Mood;
  };
}[];

// snackbar
export type SnackbarHandlerType = (data: object) => void;

// enums
export enum UrgencyInput {
  urgent = "urgent",
  important = "important",
  trivial = "trivial",
}

export enum UrgencyDisplay {
  urgent = "🔥",
  important = "⚡️",
  trivial = "🌱",
}

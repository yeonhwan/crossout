import {
  type ListBoard,
  type Todo,
  type Revenue,
  type Mood,
  type Urgency,
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

export type MonthlyData =
  | ({
      date: number;
      _count?: {
        todos: number;
      };
    } & SelectedDateDateType)[]
  | [];

export type SelectedDateDateType = {
  todos?: {
    completed: boolean;
    content: string;
    id: number;
    urgency: Urgency;
    listBoard: ListBoard;
  }[];
  revenues?: {
    purpose: string;
    revenue: number;
    id: number;
  }[];
  daylogs?: {
    content: Prisma.JsonValue;
    mood: Mood;
  };
};

export type PreferenceState = {
  isLight: boolean;
  background: string;
};

export type UserDataState = {
  preference: PreferenceState;
  username: string;
};

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

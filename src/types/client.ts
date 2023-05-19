import { type ListBoard, type Todo } from "@prisma/client";

// items

export type TodoWithListboardType = Todo & { listBoard: ListBoard | null };

export type ListboardItemType = ListBoard & {
  todos: TodoWithListboardType[];
};

export type UpdateTodoIndexDataType = {
  data: { dateRecordId: number; index: number[] };
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

import { type ListBoard, type Todo } from "@prisma/client";

// items

export type ListboardItemType = ListBoard & {
  todos: Todo[];
};

export type UpdateTodoIndexDataType = {
  data: { dateRecordId: number; index: number[] };
};

export type TodoWithListboardType = Todo & { listBoard: ListBoard | null };

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

import { create } from "zustand";
import { type Todo } from "@prisma/client";
import { produce } from "immer";

export enum SnackbarRole {
  Error = "error",
  Success = "success",
  Info = "info",
}

export type SnackbarData = {
  role: SnackbarRole;
  message: string;
  content?: string;
  handler?: (data: object) => void;
  previousData?: object;
};

export type SnackbarState = {
  open: boolean;
  snackbarData?: SnackbarData;
};

type SnackbarAction = {
  setSnackbarOpen: (openState: boolean) => void;
  setSnackbarData: (snackbarData?: SnackbarData) => void;
};

const useSnackbarStore = create<SnackbarState & SnackbarAction>()((set) => ({
  open: false,

  setSnackbarOpen: (openState: boolean) => set(() => ({ open: openState })),
  setSnackbarData: (snackbarData: SnackbarData | undefined) =>
    set(
      produce((state: SnackbarState) => {
        state.snackbarData = snackbarData;
      })
    ),
}));

export default useSnackbarStore;

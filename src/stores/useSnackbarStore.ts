import { create } from "zustand";
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
  loading: boolean;
  snackbarData?: SnackbarData;
};

type SnackbarAction = {
  setSnackbarOpen: (openState: boolean) => void;
  setSnackbarData: (snackbarData?: SnackbarData) => void;
  setSnackbarLoadingState: (newState: boolean) => void;
};

const useSnackbarStore = create<SnackbarState & SnackbarAction>()((set) => ({
  open: false,
  loading: false,

  setSnackbarOpen: (openState: boolean) =>
    set(
      produce((state: SnackbarState) => {
        state.open = openState;
      })
    ),
  setSnackbarLoadingState: (newState: boolean) =>
    set(
      produce((state: SnackbarState) => {
        state.loading = newState;
      })
    ),
  setSnackbarData: (snackbarData: SnackbarData | undefined) =>
    set(
      produce((state: SnackbarState) => {
        state.snackbarData = snackbarData;
      })
    ),
}));

export default useSnackbarStore;

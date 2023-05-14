// hooks / React
import { forwardRef } from "react";

// components
import CircleButton from "@/components/Buttons/CircleButton";

// types
import { type SnackbarContentProps } from "@/components/Snackbar/Snackbar";

// ICONS
import ReplayIcon from "@mui/icons-material/Replay";
import CloseIcon from "@mui/icons-material/Close";

const SnackbarSuccess = ({ data, ref, setOpen }: SnackbarContentProps) => {
  const { message, handler, previousData, content } = data;

  if (handler && previousData) {
    return (
      <div
        ref={ref}
        className="flex h-12 min-h-max w-80 min-w-max items-center justify-center rounded-lg bg-emerald-500 px-4"
      >
        <span className="mx-2 font-bold text-white">{message}</span>
        <span className="mx-2 font-medium text-neutral-200">'{content}'</span>
        <div className="mx-2 flex w-max justify-between">
          <CircleButton
            clickHandler={() => {
              handler(previousData);
            }}
            info="cancel"
            className="mr-1 h-6 w-6 bg-emerald-300"
          >
            <ReplayIcon className="h-4 w-4" />
          </CircleButton>
          <CircleButton
            className="mr-1 h-6 w-6 bg-emerald-300"
            clickHandler={() => {
              setOpen(false);
            }}
            info="close"
          >
            <CloseIcon className="h-4 w-4" />
          </CircleButton>
        </div>
      </div>
    );
  } else {
    return (
      <div
        ref={ref}
        className="flex h-12 min-h-max w-80 min-w-max items-center justify-center rounded-lg bg-emerald-500 px-4"
      >
        <span className="mx-2 font-bold text-white">{message}</span>
        <span className="mx-2 font-medium text-neutral-200">'{content}'</span>
        <div className="mx-2 flex w-max justify-between">
          <CircleButton
            className="mr-1 h-6 w-6 bg-emerald-300"
            clickHandler={() => {
              setOpen(false);
            }}
            info="close"
          >
            <CloseIcon className="h-4 w-4" />
          </CircleButton>
        </div>
      </div>
    );
  }
};

export default forwardRef(SnackbarSuccess);

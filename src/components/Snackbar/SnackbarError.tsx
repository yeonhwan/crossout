// components
import CircleButton from "@/components/Buttons/CircleButton";

// types
import { type SnackbarContentProps } from "@/components/Snackbar/Snackbar";

// ICONS
import ReplayIcon from "@mui/icons-material/Replay";
import CloseIcon from "@mui/icons-material/Close";

const SnackbarError = ({ data, setOpen }: SnackbarContentProps) => {
  const { message } = data;

  return (
    <div className="flex h-12 min-h-max w-80 min-w-max items-center justify-center rounded-lg bg-red-400 px-4">
      <span className="mx-2 font-bold text-white">{message}</span>
      <div className="mx-2 flex w-max justify-between">
        <CircleButton info="cancel" className="mr-1 h-6 w-6 bg-emerald-300">
          <ReplayIcon className="h-4 w-4" />
        </CircleButton>
        <CircleButton
          className="mr-1 h-6 w-6 bg-emerald-300"
          onClick={() => {
            setOpen(false);
          }}
          info="close"
        >
          <CloseIcon className="h-4 w-4" />
        </CircleButton>
      </div>
    </div>
  );
};

export default SnackbarError;

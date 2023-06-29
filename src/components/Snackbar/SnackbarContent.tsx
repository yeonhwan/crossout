// components
import CircleButton from "@/components/Buttons/CircleButton";

// icons
import ReplayIcon from "@mui/icons-material/Replay";
import CloseIcon from "@mui/icons-material/Close";
import LoaderIcon from "public/icons/spinner.svg";

// types
import { type SnackbarData } from "@/stores/useSnackbarStore";

export type SnackbarContentProps = {
  data: SnackbarData;
  setOpen: (openState: boolean) => void;
  loading: boolean;
};

const SnackbarSuccess = ({ data, setOpen, loading }: SnackbarContentProps) => {
  const { message, handler, previousData, content, role } = data;

  if (handler && previousData) {
    return (
      <div
        className={`flex h-12 min-h-max w-72 items-center justify-center rounded-lg px-4 sm:w-80 sm:min-w-max ${
          role === "success"
            ? "bg-emerald-500"
            : role === "error"
            ? "bg-red-400"
            : "bg-teal-500"
        }`}
      >
        <div className="flex w-max items-center">
          <span className="mx-2 w-max text-center text-[8px] font-bold text-white sm:text-base">
            {message}
          </span>
          {content && (
            <span className="mx-2 w-28 overflow-hidden text-ellipsis whitespace-nowrap text-center text-[8px] font-medium text-neutral-200 sm:w-max sm:max-w-[300px] sm:text-base">
              {content}
            </span>
          )}
        </div>
        <div className="mx-2 flex w-max justify-between">
          {loading ? (
            <LoaderIcon className="h-5 w-5 fill-white sm:h-6 sm:w-6" />
          ) : (
            <CircleButton
              onClick={() => {
                handler(previousData);
              }}
              info="cancel"
              className={`mr-1 h-5 w-5 sm:h-6 sm:w-6 ${
                role === "success"
                  ? "bg-emerald-300 hover:bg-emerald-400"
                  : role === "error"
                  ? "bg-red-300 hover:bg-red-400"
                  : "bg-teal-300 hover:bg-teal-400"
              }`}
            >
              <ReplayIcon className="h-4 w-4" />
            </CircleButton>
          )}
          <CircleButton
            className={`mr-1 h-5 w-5 sm:h-6 sm:w-6 ${
              role === "success"
                ? "hover:bg-emerlad-400 bg-emerald-300"
                : role === "error"
                ? "bg-red-300 hover:bg-red-400"
                : "bg-teal-300 hover:bg-teal-400"
            }`}
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
  } else {
    return (
      <div
        className={`flex h-12 min-h-max w-80 items-center justify-center rounded-lg px-4 sm:w-80 sm:min-w-max ${
          role === "success"
            ? "bg-emerald-500"
            : role === "error"
            ? "bg-red-400"
            : "bg-teal-500"
        }`}
      >
        <span className="mx-2 text-[8px] font-bold text-white sm:text-base">
          {message}
        </span>
        {content && (
          <span className="mx-2 w-28 overflow-hidden text-ellipsis whitespace-nowrap text-center text-[8px] font-medium text-neutral-200 sm:w-max sm:max-w-[300px] sm:text-base">
            {content}
          </span>
        )}
        <div className="mx-2 flex w-max justify-between">
          <CircleButton
            className={`mr-1 h-5 w-5 sm:h-6 sm:w-6 ${
              role === "success"
                ? "bg-emerald-300 hover:bg-emerald-400"
                : role === "error"
                ? "bg-red-300 hover:bg-red-400"
                : "bg-teal-300 hover:bg-teal-400"
            }`}
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
  }
};

export default SnackbarSuccess;

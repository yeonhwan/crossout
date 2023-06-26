// React, hooks
import {
  type ForwardedRef,
  forwardRef,
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
} from "react";

// Components
import Button from "@/components/Buttons/Button";

// api
import { api } from "@/utils/api";

// stores
import useDateStore from "@/stores/useDateStore";

// styles
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

// Icons
import LoaderIcon from "public/icons/spinner.svg";
import MoneyAllIcon from "public/icons/money_all.svg";

type TodoFormProps = {
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

const RevenueForm = (
  { setOpenDialog }: TodoFormProps,
  ref: ForwardedRef<HTMLFormElement>
) => {
  const [purposeInput, setPurposeInput] = useState("");
  const [revenueInput, setRevenueInput] = useState("");
  const [isProceed, setIsProceed] = useState(false);
  const { year, month, date } = useDateStore((state) => state.dateObj);
  const { setSnackbarOpen, setSnackbarData, setSnackbarLoadingState } =
    useSnackbarStore((state) => state);
  const utils = api.useContext();
  const [revenueState, setRevenueState] = useState(false);

  const cancelButtonHandler = () => {
    setPurposeInput("");
    setOpenDialog(false);
  };

  const { mutate: abortCreateRevenue } = api.revenue.deleteRevenue.useMutation({
    onSuccess: async () => {
      setSnackbarLoadingState(false);
      await utils.revenue.getRevenues.invalidate();
      setSnackbarOpen(true);
      setSnackbarData({
        message: "Canceled create new revenue",
        role: SnackbarRole.Success,
      });
    },
    onError: () => {
      setSnackbarOpen(true);
      setSnackbarData({
        message: "Request failed. Please try again or report the issue.",
        role: SnackbarRole.Error,
      });
    },
  });

  const { mutate: createRevenue } = api.revenue.createRevenue.useMutation({
    onSuccess: async (res) => {
      const { content, id, dateRecordId } = res.data;
      setSnackbarData({
        role: SnackbarRole.Success,
        message: "New revenue",
        content,
        previousData: { data: { id, dateRecordId } },
        handler: (data) => {
          setSnackbarLoadingState(true);
          abortCreateRevenue(
            data as { data: { id: number; dateRecordId: number } }
          );
        },
      });
      setSnackbarOpen(true);
      await utils.revenue.getRevenues.invalidate();
      setIsProceed(false);
      setOpenDialog(false);
    },
    onError: () => {
      setSnackbarOpen(true);
      setSnackbarData({
        message: "Request failed. Please try again or report the issue.",
        role: SnackbarRole.Error,
      });
    },
  });

  const confirmOnClickHandler = () => {
    setIsProceed(true);
    createRevenue({
      data: {
        purpose: purposeInput,
        revenue: revenueInput ? Number(revenueInput) : 0,
      },
      dateObj: {
        year,
        month,
        date,
      },
    });
  };

  useEffect(() => {
    const revenueInputRegEx = new RegExp(/^(\+|\-)?\d*\.?\d*$/);
    if (revenueInputRegEx.test(revenueInput) && !revenueState) {
      setRevenueState(true);
    } else if (!revenueInputRegEx.test(revenueInput) && revenueState) {
      setRevenueState(false);
    }

    return;
  }, [revenueInput]);

  return (
    <form
      ref={ref}
      className="flex h-4/5 max-h-[550px] min-h-[500px] w-[90%] flex-col items-center justify-around rounded-lg bg-neutral-200/40 text-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-200 sm:min-h-[500px] sm:w-1/4 sm:min-w-[500px]"
    >
      <div className="flex h-[10%] flex-col items-center justify-center pt-8">
        <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/50 p-2 dark:bg-teal-500/50">
          <MoneyAllIcon className="h-6 w-6 fill-white" />
        </span>
        <h1 className="ml-1 text-lg font-bold sm:text-xl">New Revenue</h1>
        <p className="text-xs text-neutral-700 dark:text-neutral-200">
          <span className="text-red-400">*</span>
          should be filled in to submit
        </p>
      </div>
      <div className="flex h-2/5 w-2/3 flex-col">
        <div className="mb-2 flex flex-col justify-center focus-within:text-teal-600 dark:focus-within:text-teal-400">
          <label
            className="mb-1 rounded-md font-semibold after:text-red-400 after:content-['*']"
            htmlFor="purpose"
          >
            Purpose of revenue
          </label>
          <p className="mb-3 text-xs">Purpose can be 45 characters at max</p>
          <input
            className="mb-2 border-0 px-2 py-1 text-neutral-700 shadow-lg ring-2 ring-neutral-300 focus:outline-none focus:ring-teal-400 dark:bg-neutral-600 dark:text-neutral-200 dark:ring-neutral-500 dark:placeholder:text-white dark:focus:ring-teal-500"
            id="purpose"
            placeholder="Type in your purpose"
            value={purposeInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPurposeInput(e.currentTarget.value);
            }}
          />
          <span
            className={`self-end text-xs ${
              purposeInput.length > 45 || purposeInput.length <= 0
                ? "text-red-400"
                : ""
            }`}
          >{`${purposeInput.length} / 45`}</span>
        </div>
        <div className="mb-2 flex h-20 flex-col justify-center focus-within:text-teal-600 dark:focus-within:text-teal-400">
          <label
            className="rounded-md font-semibold after:text-red-400 after:content-['*']"
            htmlFor="money"
          >
            Amount of Revenue
          </label>
          <p className="mb-2 text-xs">Type negative values with '-' sign</p>
          <div
            className={`flex h-8 w-full items-center justify-center rounded-md bg-white ring-2 ring-neutral-300 focus:outline-none dark:bg-neutral-600 dark:ring-neutral-500 ${
              revenueState
                ? "focus-within:ring-teal-400 dark:focus-within:ring-teal-500"
                : "focus-within:ring-red-400 dark:focus-within:ring-red-400"
            }`}
          >
            <span
              className={`font-semibold ${!revenueState ? "text-red-300" : ""}`}
            >
              $
            </span>
            <input
              className="h-full w-[85%] rounded-md border-0 px-2 py-1 text-center text-neutral-700 focus:outline-none dark:bg-neutral-600 dark:text-neutral-200"
              id="money"
              placeholder="0"
              value={revenueInput.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setRevenueInput(e.currentTarget.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex">
        {isProceed ? (
          <Button className="pointer-events-none flex h-10 items-center justify-center px-4 hover:bg-neutral-400 dark:hover:bg-neutral-700">
            <LoaderIcon className="h-6 w-6 fill-white" />
          </Button>
        ) : (
          <>
            <Button
              className={`h-8 hover:text-white ${
                purposeInput.length <= 0 || !revenueState
                  ? "pointer-events-none bg-neutral-400 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-800"
                  : ""
              }`}
              onClick={confirmOnClickHandler}
            >
              Confirm
            </Button>
            <Button
              className="hover:bg-red-400 dark:hover:bg-red-500"
              onClick={cancelButtonHandler}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default forwardRef(RevenueForm);

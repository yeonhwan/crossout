// React, hooks
import {
  type ForwardedRef,
  forwardRef,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";

// Components
import Button from "@/components/Buttons/Button";
import ListboardSelect from "../Select/ListboardSelect";

// api
import { api } from "@/utils/api";

// stores
import useDateStore from "@/stores/useDateStore";

// styles
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

// Icons
import LoaderIcon from "public/icons/spinner.svg";

// Urgency Enum
enum Urgency {
  urgent = "urgent",
  important = "important",
  trivial = "trivial",
}

type SnackbarHandlerType = (data: object) => void;

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
  const { setSnackbarOpen, setSnackbarData } = useSnackbarStore(
    (state) => state
  );
  const utils = api.useContext();

  const cancelButtonHandler = () => {
    setPurposeInput("");
    setOpenDialog(false);
  };

  // const { mutate: abortCreateTodo } = api.todo.deleteTodo.useMutation({
  //   onSuccess: async (res) => {
  //     const { message, content } = res.data;
  //     await utils.todo.getTodos.invalidate();
  //     setSnackbarOpen(true);
  //     setSnackbarData({ message, content, role: SnackbarRole.Success });
  //   },
  //   onError: (err) => {
  //     const { message } = err;
  //     setSnackbarOpen(true);
  //     setSnackbarData({ message, role: SnackbarRole.Error });
  //   },
  // });

  const { mutate: createRevenue } = api.revenue.createRevenue.useMutation({
    onSuccess: async (res) => {
      const { message, content } = res.data;
      setSnackbarData({
        role: SnackbarRole.Success,
        message,
        content,
        // previousData: { data: { id } },
        // handler: abortCreateTodo as SnackbarHandlerType,
      });
      setSnackbarOpen(true);
      await utils.revenue.getRevenues.invalidate();
      setIsProceed(false);
      setOpenDialog(false);
    },
    onError: (err) => {
      const { message } = err;
      setSnackbarOpen(true);
      setSnackbarData({ message, role: SnackbarRole.Error });
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

  const revenueInputRegEx = new RegExp(/^(\+|\-)?\d*\.?\d*$/);

  return (
    <form
      ref={ref}
      className="flex h-2/3 w-1/3 flex-col items-center justify-evenly rounded-lg bg-neutral-400/40 py-4"
    >
      <h1 className="text-2xl font-bold">New Revenue</h1>
      <div className="flex h-2/5 w-2/3 flex-col">
        <label className="text-lg font-semibold" htmlFor="purpose">
          Where do you spent to / earn from ?
        </label>
        <input
          className="mb-2 px-2 py-1 text-center"
          id="purpose"
          placeholder="Type in your purpose"
          value={purposeInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPurposeInput(e.currentTarget.value);
          }}
        />
        <label className="text-lg font-semibold" htmlFor="money">
          How much money you spent / earn ?
        </label>
        <div className="flex h-[20%] w-full items-center justify-center rounded-lg bg-white">
          <span className="font-semibold">$</span>
          <input
            className="h-full w-[85%] rounded-xl border-0 px-2 py-1 text-center outline-none"
            id="money"
            placeholder="0"
            value={revenueInput.toString()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (!revenueInputRegEx.test(e.currentTarget.value)) {
                window.alert("Wrong Value");
              } else {
                setRevenueInput(e.currentTarget.value);
              }
            }}
          />
        </div>
      </div>
      <div className="flex">
        {isProceed ? (
          <Button className="pointer-events-none flex justify-center px-4">
            <LoaderIcon className="h-8 w-8 fill-white" />
          </Button>
        ) : (
          <>
            <Button
              className="hover:bg-emerald-400 dark:hover:bg-emerald-500"
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

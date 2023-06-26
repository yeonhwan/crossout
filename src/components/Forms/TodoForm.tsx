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

// Icons
import LoaderIcon from "public/icons/spinner.svg";
import TodosIcon from "public/icons/todos.svg";

// stores
import useDateStore from "@/stores/useDateStore";
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

// Urgency Enum
enum Urgency {
  urgent = "urgent",
  important = "important",
  trivial = "trivial",
}

type TodoFormProps = {
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

const TodoForm = (
  { setOpenDialog }: TodoFormProps,
  ref: ForwardedRef<HTMLFormElement>
) => {
  const [todoInput, setTodoInput] = useState("");
  const [urgencyInput, setUrgencyInput] = useState<Urgency>(Urgency.trivial);
  const [listboardInput, setListboardInput] = useState<number | undefined>();
  const [isProceed, setIsProceed] = useState(false);
  const { year, month, date } = useDateStore((state) => state.dateObj);
  const { setSnackbarOpen, setSnackbarData, setSnackbarLoadingState } =
    useSnackbarStore((state) => state);
  const utils = api.useContext();

  const cancelButtonHandler = () => {
    setTodoInput("");
    setUrgencyInput(Urgency.trivial);
    setListboardInput(undefined);
    setOpenDialog(false);
  };

  const { mutate: abortCreateTodo } = api.todo.deleteTodo.useMutation({
    onSuccess: async () => {
      setSnackbarLoadingState(false);
      await utils.todo.getTodos.invalidate();
      setSnackbarOpen(true);
      setSnackbarData({
        message: "Canceled create new todo",
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

  const { mutate: createTodo } = api.todo.createTodo.useMutation({
    onSuccess: async (res) => {
      const { content, id, dateRecordId } = res.data;
      setSnackbarData({
        role: SnackbarRole.Success,
        message: "New Todo",
        content,
        previousData: { data: { id, dateRecordId } },
        handler: (data) => {
          setSnackbarLoadingState(true);
          abortCreateTodo(
            data as { data: { id: number; dateRecordId: number } }
          );
        },
      });
      setSnackbarOpen(true);
      await utils.todo.getTodos.invalidate();
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
    createTodo({
      content: todoInput,
      urgency: urgencyInput,
      dateObj: {
        year,
        month,
        date,
      },
      listBoardId: listboardInput,
    });
  };

  return (
    <form
      ref={ref}
      className="flex h-4/5 max-h-[550px] min-h-[500px] w-[90%] flex-col items-center justify-around rounded-lg bg-neutral-200/40 text-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-200 sm:min-h-[500px] sm:w-1/4 sm:min-w-[500px]"
    >
      <div className="mb-4 flex h-[10%] w-max flex-col items-center pt-8">
        <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/50 p-2 dark:bg-teal-500/50">
          <TodosIcon className="h-8 w-8 fill-white" />
        </span>
        <h1 className="ml-1 text-lg font-bold sm:text-xl">New Todo</h1>
        <p className="text-xs text-neutral-700 dark:text-neutral-200">
          <span className="text-red-400">*</span>
          should be filled in to submit
        </p>
      </div>
      <div className="flex h-[60%] w-2/3 flex-col justify-center">
        <div className="mb-2 flex flex-col focus-within:text-teal-600 dark:focus-within:text-teal-400">
          <label
            className="mb-1 rounded-md font-semibold after:text-red-400 after:content-['*']"
            htmlFor="todo"
          >
            Todo name
          </label>
          <input
            className="mb-2 border-0 px-2 py-1 text-neutral-700 shadow-lg ring-2 ring-neutral-300 focus:outline-none focus:ring-teal-400 dark:bg-neutral-600 dark:text-neutral-200 dark:ring-neutral-500 dark:placeholder:text-white dark:focus:ring-teal-500"
            id="todo"
            placeholder="Type in your todo"
            value={todoInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTodoInput(e.currentTarget.value);
            }}
          />
        </div>
        <div className="mb-2 flex flex-col focus-within:text-teal-600 dark:focus-within:text-teal-400">
          <label className="mb-1 font-semibold" htmlFor="urgency">
            Urgency
          </label>
          <select
            className="mb-2 rounded-md border-0 py-2 text-center text-black shadow-lg ring-neutral-300 hover:cursor-pointer focus:border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 dark:bg-neutral-600 dark:text-white dark:ring-neutral-500 dark:focus:ring-teal-500"
            id="urgency"
            value={urgencyInput}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setUrgencyInput(e.currentTarget.value as Urgency);
            }}
          >
            <option value={Urgency.trivial}>🌱trivial</option>
            <option value={Urgency.important}>⚡️important</option>
            <option value={Urgency.urgent}>🔥urgent</option>
          </select>
        </div>
        <div className="mb-2 flex flex-col focus-within:text-teal-600 dark:focus-within:text-teal-400">
          <label className="mb-1 font-semibold" htmlFor="listboard">
            Listboard
          </label>
          <ListboardSelect
            className="rounded-md border-0 py-2 text-black shadow-lg ring-neutral-300 focus:outline-none focus:ring-2 focus:ring-teal-400 dark:bg-neutral-600 dark:text-white dark:ring-neutral-500 dark:focus:ring-teal-500"
            input={listboardInput}
            onChange={setListboardInput}
          />
        </div>
      </div>
      <div className="flex h-[10%]">
        {isProceed ? (
          <Button className="pointer-events-none flex h-10 items-center justify-center px-4 py-0 hover:bg-neutral-400 dark:hover:bg-neutral-700">
            <LoaderIcon className="h-6 w-6 fill-neutral-800 dark:fill-white" />
          </Button>
        ) : (
          <>
            <Button
              className={`h-8 hover:text-white ${
                todoInput.length <= 0
                  ? "pointer-events-none bg-neutral-400 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-800"
                  : ""
              }`}
              onClick={confirmOnClickHandler}
            >
              Confirm
            </Button>
            <Button
              className="h-8 hover:bg-red-400 hover:text-white dark:hover:bg-red-500"
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

export default forwardRef(TodoForm);

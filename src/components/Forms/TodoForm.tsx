// Components
import Button from "@/components/Buttons/Button";
import ListboardSelect from "../Select/ListboardSelect";
import Select from "@/components/Select/Select";

// React, hooks
import { forwardRef, useState } from "react";

// api
import { api } from "@/utils/api";

// stores
import useDateStore from "@/stores/useDateStore";
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

// icons
import LoaderIcon from "public/icons/spinner.svg";
import TodosIcon from "public/icons/todos.svg";

// types
import type { ForwardedRef, Dispatch, SetStateAction } from "react";

type Urgency = "urgent" | "important" | "trivial";

type TodoFormProps = {
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

const TodoForm = (
  { setOpenDialog }: TodoFormProps,
  ref: ForwardedRef<HTMLFormElement>
) => {
  const [todoInput, setTodoInput] = useState("");
  const [urgencyInput, setUrgencyInput] = useState<Urgency>("trivial");
  const [listboardInput, setListboardInput] = useState<number | undefined>();
  const [isProceed, setIsProceed] = useState(false);
  const { year, month, date } = useDateStore((state) => state.dateObj);
  const { setSnackbarOpen, setSnackbarData, setSnackbarLoadingState } =
    useSnackbarStore((state) => state);
  const utils = api.useContext();

  // abort create todo api call
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

  // create todo api call
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

  // Handlers
  const cancelButtonHandler = () => {
    setTodoInput("");
    setUrgencyInput("trivial");
    setListboardInput(undefined);
    setOpenDialog(false);
  };

  const confirmButtonHandler = () => {
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
        <div className="mb-1 flex flex-col focus-within:text-teal-600 dark:focus-within:text-teal-400">
          <label
            className="mb-1 rounded-md font-semibold after:text-red-400 after:content-['*']"
            htmlFor="todo"
          >
            Todo name
          </label>
          <p className="mb-3 text-xs">Todo can be 45 characters at max</p>
          <input
            className="mb-2 border-0 px-2 py-1 text-neutral-700 shadow-lg ring-2 ring-neutral-300 focus:outline-none focus:ring-teal-400 dark:bg-neutral-600 dark:text-neutral-200 dark:ring-neutral-500 dark:placeholder:text-white dark:focus:ring-teal-500"
            id="todo"
            placeholder="Type in your todo"
            value={todoInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTodoInput(e.currentTarget.value);
            }}
          />
          <span
            className={`self-end text-xs ${
              todoInput.length > 45 || todoInput.length <= 0
                ? "text-red-400"
                : ""
            }`}
          >{`${todoInput.length} / 45`}</span>
        </div>
        <div className="mb-2 flex flex-col focus-within:text-teal-600 dark:focus-within:text-teal-400">
          <label className="mb-1 font-semibold" htmlFor="urgency">
            Urgency
          </label>
          <Select
            id="urgency"
            value={urgencyInput}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setUrgencyInput(e.currentTarget.value as Urgency);
            }}
            className="border-0 bg-white fill-neutral-700 text-center text-neutral-700 ring-2 ring-neutral-300 focus-within:fill-teal-500 focus-within:outline-none focus-within:ring-teal-400 hover:cursor-pointer focus:border-0 focus:ring-2 dark:bg-neutral-600 dark:fill-white dark:text-neutral-200 dark:ring-neutral-500 dark:focus-within:ring-teal-500"
          >
            <>
              <option value={"trivial"}>🌱trivial</option>
              <option value={"important"}>⚡️important</option>
              <option value={"urgent"}>🔥urgent</option>
            </>
          </Select>
        </div>
        <div className="mb-2 flex flex-col focus-within:text-teal-600 dark:focus-within:text-teal-400">
          <label className="mb-1 font-semibold" htmlFor="listboard">
            Listboard
          </label>
          <ListboardSelect
            className="border-0 bg-white fill-neutral-700 text-center text-neutral-700 ring-2 ring-neutral-300 focus-within:fill-teal-500 focus-within:outline-none focus-within:ring-teal-400 hover:cursor-pointer focus:border-0 focus:ring-2 dark:bg-neutral-600 dark:fill-neutral-200 dark:text-neutral-200 dark:ring-neutral-500 dark:focus-within:ring-teal-500"
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
                todoInput.length <= 0 || todoInput.length > 45
                  ? "pointer-events-none bg-neutral-400 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-800"
                  : ""
              }`}
              onClick={confirmButtonHandler}
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

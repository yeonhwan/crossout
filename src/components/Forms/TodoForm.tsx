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
import loader_styles from "@/styles/loader.module.css";
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

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

const TodoForm = (
  { setOpenDialog }: TodoFormProps,
  ref: ForwardedRef<HTMLFormElement>
) => {
  const [todoInput, setTodoInput] = useState("");
  const [urgencyInput, setUrgencyInput] = useState<Urgency>(Urgency.trivial);
  const [listboardInput, setListboardInput] = useState<number | undefined>();
  const [isProceed, setIsProceed] = useState(false);
  const { year, month, date } = useDateStore((state) => state.dateObj);
  const { setSnackbarOpen, setSnackbarData } = useSnackbarStore(
    (state) => state
  );
  const utils = api.useContext();

  const cancelButtonHandler = () => {
    setTodoInput("");
    setUrgencyInput(Urgency.trivial);
    setListboardInput(undefined);
    setOpenDialog(false);
  };

  const { mutate: abortCreateTodo } = api.todo.deleteTodo.useMutation({
    onSuccess: async (res) => {
      const { message, content } = res.data;
      await utils.todo.getTodos.invalidate();
      setSnackbarOpen(true);
      setSnackbarData({ message, content, role: SnackbarRole.Success });
    },
    onError: (err) => {
      const { message } = err;
      setSnackbarOpen(true);
      setSnackbarData({ message, role: SnackbarRole.Error });
    },
  });

  const { mutate: createTodo } = api.todo.createTodo.useMutation({
    onSuccess: async (res) => {
      const { message, content, id } = res.data;
      setSnackbarData({
        role: SnackbarRole.Success,
        message,
        content,
        previousData: { data: { id } },
        handler: abortCreateTodo as SnackbarHandlerType,
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
      className="text:-black flex h-2/3 w-1/3 flex-col items-center justify-evenly rounded-lg bg-neutral-200/40 py-4 dark:bg-neutral-800/80 dark:text-white"
    >
      <h1 className="text-2xl font-bold">New Todo</h1>
      <div className="flex w-2/3 flex-col">
        <label className="rounded-md text-lg font-semibold" htmlFor="todo">
          What do you have to do?
        </label>
        <input
          className="mb-2 px-2 py-1 text-black focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:bg-neutral-400 dark:text-white dark:placeholder:text-white"
          id="todo"
          placeholder="Type in your todo"
          value={todoInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTodoInput(e.currentTarget.value);
          }}
        />
        <label className="text-lg font-semibold" htmlFor="urgency">
          How much is it urgent?
        </label>
        <select
          className="mb-2 rounded-md py-2 text-center text-black hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:bg-neutral-400 dark:text-white"
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
        <label className="text-lg font-semibold" htmlFor="listboard">
          Select your listboards
        </label>
        <ListboardSelect
          className="rounded-md py-2 text-black focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:bg-neutral-400 dark:text-white"
          input={listboardInput}
          onChange={setListboardInput}
        />
      </div>
      <div className="flex">
        {isProceed ? (
          <Button className="pointer-events-none flex justify-center px-4">
            <span className="flex h-full w-full items-center justify-center">
              <span className={`${loader_styles.loader as string}`} />
            </span>
          </Button>
        ) : (
          <>
            <Button onClick={confirmOnClickHandler}>Confirm</Button>
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

export default forwardRef(TodoForm);

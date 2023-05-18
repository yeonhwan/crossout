// React
import {
  type ForwardedRef,
  forwardRef,
  type Dispatch,
  type SetStateAction,
} from "react";

// hooks
import { useState } from "react";

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

// Props TYPE
type TodoFormProps = {
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

// Urgency Enum
enum Urgency {
  urgent = "urgent",
  important = "important",
  trivial = "trivial",
}

type SnackbarHandlerType = (data: object) => void;

function TodoForm(
  { setOpenDialog }: TodoFormProps,
  ref: ForwardedRef<HTMLFormElement>
) {
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
      className="flex h-2/3 w-1/3 flex-col items-center justify-evenly rounded-lg bg-neutral-400/40 py-4"
    >
      <h1 className="text-2xl font-bold">New Todo</h1>
      <div className="flex w-2/3 flex-col">
        <label className="text-lg font-semibold" htmlFor="todo">
          What do you have to do?
        </label>
        <input
          className="mb-2 px-2 py-1"
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
          className="mb-2 rounded-lg py-1 text-center hover:cursor-pointer"
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
        <ListboardSelect input={listboardInput} onChange={setListboardInput} />
        <label className="text-lg font-semibold" htmlFor="deadline">
          Is there a deadline?
        </label>
        <input
          className="mb-2 rounded-xl px-2 py-1 text-center"
          id="deadline"
          type="date"
          lang="en"
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
            <Button onClick={cancelButtonHandler}>Cancel</Button>
          </>
        )}
      </div>
    </form>
  );
}

export default forwardRef(TodoForm);

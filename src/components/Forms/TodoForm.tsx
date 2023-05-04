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

// Props TYPE
type TodoFormProps = {
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

function TodoForm(
  { setOpenDialog }: TodoFormProps,
  ref: ForwardedRef<HTMLFormElement>
) {
  const [todoInput, setTodoInput] = useState("");
  const [urgencyInput, setUrgencyInput] = useState("trivial");
  const [listboardsInput, setListboardsInput] = useState("");

  const cancelButtonHandler = () => {
    setTodoInput("");
    setUrgencyInput("trivial");
    setListboardsInput("");
    setOpenDialog(false);
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
            setUrgencyInput(e.currentTarget.value);
          }}
        >
          <option value="trivial">🌱trivial</option>
          <option value="important">⚡️important</option>
          <option value="urgent">🔥urgent</option>
        </select>
        <label className="text-lg font-semibold" htmlFor="listboard">
          Select your listboards
        </label>
        <select
          className="rounded-lg py-1 text-center hover:cursor-pointer"
          id="listboard"
          value={listboardsInput}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setListboardsInput(e.currentTarget.value);
          }}
        >
          <option value="">none</option>
          <option value="dummy">dummy</option>
          <option value="dummytwo">dummy two</option>
        </select>
      </div>
      <div className="flex">
        <Button>Confirm</Button>
        <Button onClick={cancelButtonHandler}>Cancel</Button>
      </div>
    </form>
  );
}

export default forwardRef(TodoForm);

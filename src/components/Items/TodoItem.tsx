// components
import CircleButton from "@/components/Buttons/CircleButton";

// ICONS
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";

// Types
import { type Todo } from "@prisma/client";

// libs
import dayjs from "dayjs";
import ClickAwayListener from "@mui/base/ClickAwayListener";

// api
import { api } from "@/utils/api";

// hooks
import React, { useState } from "react";

// types
type TodoItemProps = {
  data: Todo;
};

type UpdateTodoData = {
  id: number;
  content?: string;
  urgency?: typeof Urgency;
  listboardId?: number;
  deadline?: Date;
  completed?: boolean;
};

enum Urgency {
  urgent = "🔥",
  important = "⚡️",
  trivial = "🌱",
}

// Urgency Enum
enum UrgencyInput {
  urgent = "urgent",
  important = "important",
  trivial = "trivial",
}

const clickHandler = (): void => {
  console.log("clicked");
};

const TodoItem = ({ data }: TodoItemProps) => {
  const { urgency, content, deadline, userId, id } = data;
  const deadlineString = deadline ? dayjs(deadline).format("YYYY-M-D") : null;
  const [isUpdating, setIsUpdating] = useState(false);
  const [todoInput, setTodoInput] = useState(content);
  const [urgencyInput, setUrgencyInput] = useState(urgency);

  const cancelUpdateTodo = () => {
    setTodoInput(content);
    setUrgencyInput(urgency);
    setIsUpdating(false);
  };

  const updateTodoData = {
    id,
    content: todoInput,
    urgency: urgencyInput,
  };

  const { mutate: updateTodo } = api.todo.updateTodo.useMutation({
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  if (!isUpdating) {
    return (
      <div className="flex w-full items-center justify-between px-10 py-4 text-white">
        <div className="flex w-max">
          <p className="w-1/12">{Urgency[urgency]}</p>
          {deadlineString && <p>{deadlineString}</p>}
        </div>
        <p className="w-8/12 text-center">{content}</p>
        <div className="flex w-1/12 justify-between">
          <CircleButton
            info="edit"
            className="h-6 w-6 p-0"
            clickHandler={() => {
              setIsUpdating(true);
            }}
          >
            <EditIcon className="h-4 w-4" />
          </CircleButton>
          <CircleButton
            info="delete"
            className="h-6 w-6 p-0"
            clickHandler={clickHandler}
          >
            <ClearIcon className="h-4 w-4" />
          </CircleButton>
        </div>
      </div>
    );
  } else {
    return (
      <ClickAwayListener onClickAway={cancelUpdateTodo}>
        <div className="flex w-full items-center justify-between px-10 py-4 text-white">
          <div className="flex w-max">
            <select
              className="hover:cur rounded-xl bg-neutral-400/40 px-2 outline-none hover:cursor-pointer"
              value={urgencyInput}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setUrgencyInput(e.currentTarget.value as UrgencyInput);
              }}
            >
              <option value={UrgencyInput.trivial}>🌱trivial</option>
              <option value={UrgencyInput.important}>⚡️important</option>
              <option value={UrgencyInput.urgent}>🔥urgent</option>
            </select>
            {deadlineString && <p>{deadlineString}</p>}
          </div>
          <input
            className="w-8/12 bg-neutral-400/40 py-1 text-center align-middle outline-none"
            value={todoInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTodoInput(e.currentTarget.value);
            }}
          />
          <div className="flex w-1/12 justify-between">
            <CircleButton
              info="apply"
              className="h-6 w-6 p-0"
              clickHandler={() => {
                if (window.confirm("Are you sure want to apply?")) {
                  updateTodo({ data: updateTodoData });
                }
              }}
            >
              <CheckIcon className="h-4 w-4" />
            </CircleButton>
            <CircleButton
              info="cancel"
              className="h-6 w-6 p-0"
              clickHandler={cancelUpdateTodo}
            >
              <ClearIcon className="h-4 w-4" />
            </CircleButton>
          </div>
        </div>
      </ClickAwayListener>
    );
  }
};

export default TodoItem;

// components
import CircleButton from "@/components/Buttons/CircleButton";

// ICONS
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";

// Types
import { type Todo } from "@prisma/client";

// libs
import dayjs from "dayjs";

// api
import { api } from "@/utils/api";

// hooks
import { useState, useRef } from "react";

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

const clickHandler = (): void => {
  console.log("clicked");
};

const TodoItem = ({ data }: TodoItemProps) => {
  const { urgency, content, deadline, userId, id } = data;
  const deadlineString = deadline ? dayjs(deadline).format("YYYY-M-D") : null;
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isUpdating) {
    return (
      <div className="flex w-full justify-between px-10 text-white">
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
      <div className="flex w-full justify-between px-10 text-white">
        <div className="flex w-max">
          <p className="w-1/12">{Urgency[urgency]}</p>
          {deadlineString && <p>{deadlineString}</p>}
        </div>
        <input className="w-8/12 text-center text-black" value={content} />
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
  }
};

export default TodoItem;

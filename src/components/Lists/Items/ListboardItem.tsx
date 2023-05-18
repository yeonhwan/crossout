// React, hooks
import { type Dispatch, type SetStateAction, useState } from "react";

// components
import CircleButton from "@/components/Buttons/CircleButton";
import ListView from "../ListView";

//ICONS
import DeleteIcon from "@mui/icons-material/Delete";

// types
import { type ListboardsDataType } from "@/pages/[userId]/listboards";
import { type Todo } from "@prisma/client";

type ListboardItemProps = {
  data: ListboardsDataType;
  popperOpen: () => void;
  setPopperData: Dispatch<SetStateAction<Todo[] | null>>;
};

export default function ListboardItem({
  data,
  popperOpen,
}: ListboardItemProps) {
  const [isActive, setIsActive] = useState(false);
  const [isTodoListOpen, setIsTodoListOpen] = useState(false);

  return (
    <div
      className={`min-h-[250px] min-w-[280px] max-w-2xl rounded-3xl border-2 border-neutral-700 bg-neutral-700/60 shadow-xl transition-all duration-75 hover:cursor-pointer ${
        isActive ? "scale-[95%]" : ""
      }`}
      onMouseDown={() => {
        setIsActive(true);
      }}
      onMouseUp={() => {
        setIsActive(false);
        popperOpen();
      }}
    >
      <div className="flex h-2/3 w-full items-center justify-between rounded-t-3xl border-b-2 border-b-neutral-700 bg-neutral-500 px-2 py-3">
        <p className="text-white">{data.title}</p>
        <div className="flex">
          <CircleButton
            clickHandler={(e) => {
              e?.stopPropagation();
              console.log("clicked");
            }}
            info="Delete listboard"
            className="mr-1 h-6 w-6"
          >
            <DeleteIcon className="h-4 w-4" />
          </CircleButton>
        </div>
      </div>
      <div className="flex h-full w-full flex-col px-2 py-1">
        <p className="text-xs text-neutral-300">{data.description}</p>
        <div className="mt-2 flex max-h-[150px] flex-col">
          <ListView className="items-start px-2">
            {data.todos.length ? (
              data.todos.map((todo) => <li key={todo.id}>{todo.content}</li>)
            ) : (
              <p>This listboard is empty</p>
            )}
          </ListView>
        </div>
      </div>
    </div>
  );
}

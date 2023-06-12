// React
import {
  type MutableRefObject,
  type Dispatch,
  type SetStateAction,
} from "react";

// components
import CircleButton from "@/components/Buttons/CircleButton";

// ICONS
import OpenWithIcon from "@mui/icons-material/OpenWith";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

// styles
import loader_styles from "@/styles/loader.module.css";

// types
import { type TodoWithListboardType } from "@/types/client";

type TodoControllersProps = {
  sortingTodos: boolean;
  setSortingTodos: Dispatch<SetStateAction<boolean>>;
  updateTodoIndex: () => void;
  savedTodosData: MutableRefObject<TodoWithListboardType[]>;
  setTodosData: Dispatch<SetStateAction<TodoWithListboardType[] | undefined>>;
  isSortProceed: boolean;
  setIsSortProceed: Dispatch<SetStateAction<boolean>>;
};

const TodoControllers = ({
  sortingTodos,
  setSortingTodos,
  updateTodoIndex,
  setTodosData,
  savedTodosData,
  isSortProceed,
  setIsSortProceed,
}: TodoControllersProps) => {
  const cancelSortingHandler = () => {
    setTodosData(savedTodosData.current);
    setSortingTodos(false);
  };

  const applySortingHandler = () => {
    setSortingTodos(false);
    setIsSortProceed(true);
    updateTodoIndex();
  };

  return (
    <div className="flex h-max w-max items-center justify-center self-end">
      {isSortProceed && (
        <div className="mr-2 flex h-6 w-8 items-center justify-center">
          <span className={`ml-2 ${loader_styles.loader as string}`} />
        </div>
      )}
      <div className="my-1 mr-4 flex h-max min-w-max items-center justify-center rounded-full px-2 py-1">
        {/* {!sortingTodos && (
          <select className="mx-2 rounded-xl bg-neutral-600 px-2 py-[3px] text-white outline-none hover:cursor-pointer">
            <option>sort</option>
          </select>
        )} */}
        {!sortingTodos ? (
          <CircleButton
            onClick={() => {
              setSortingTodos(true);
            }}
            info="switching mode"
            className="h-6 w-6 hover:bg-cyan-400 dark:hover:bg-cyan-500"
          >
            <OpenWithIcon className="h-4 w-4" />
          </CircleButton>
        ) : (
          <>
            <CircleButton
              onClick={cancelSortingHandler}
              info="cancel"
              className="mr-1 h-6 w-6 bg-red-300 hover:bg-red-400  dark:bg-red-400 dark:hover:bg-red-500"
            >
              <CloseIcon className="h-4 w-4" />
            </CircleButton>
            <CircleButton
              onClick={applySortingHandler}
              info="apply"
              className="mr-1 h-6 w-6 bg-emerald-300 hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-500"
            >
              <CheckIcon className="h-4 w-4" />
            </CircleButton>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoControllers;

// components
import CircleButton from "@/components/Buttons/CircleButton";
import Select from "@/components/Select/Select";

// icons
import OpenWithIcon from "@mui/icons-material/OpenWith";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import LoaderIcon from "public/icons/spinner.svg";

// types
import type { TodoWithListboardType } from "@/types/client";
import type { SortingOption } from "@/components/Tabs/Panels/Todos/TodoPanel";
import type { MutableRefObject, Dispatch, SetStateAction } from "react";

type TodoControllersProps = {
  reorderingTodos: boolean;
  setReorderingTodos: Dispatch<SetStateAction<boolean>>;
  updateTodoIndex: () => void;
  prevTodosData: MutableRefObject<TodoWithListboardType[] | undefined>;
  prevTodoIndexes: MutableRefObject<number[]>;
  setTodosData: Dispatch<SetStateAction<TodoWithListboardType[] | undefined>>;
  setTodoIndexes: Dispatch<SetStateAction<number[]>>;
  isReorderProceed: boolean;
  setIsReorderProceed: Dispatch<SetStateAction<boolean>>;
  sortingOption: SortingOption;
  setSortingOption: Dispatch<SetStateAction<SortingOption>>;
};

const TodoControllers = ({
  reorderingTodos,
  setReorderingTodos,
  updateTodoIndex,
  setTodosData,
  prevTodosData,
  isReorderProceed,
  setIsReorderProceed,
  prevTodoIndexes,
  setTodoIndexes,
  sortingOption,
  setSortingOption,
}: TodoControllersProps) => {
  // Handlers
  const cancelSortingButtonHandler = () => {
    setTodosData(prevTodosData.current);
    setReorderingTodos(false);
    setTodoIndexes(prevTodoIndexes.current);
  };

  const applySortingButtonHandler = () => {
    setReorderingTodos(false);
    setIsReorderProceed(true);
    updateTodoIndex();
  };

  return (
    <div className="flex h-max w-max items-center justify-center self-end">
      {isReorderProceed && (
        <LoaderIcon className="h-8 w-8 fill-neutral-700 dark:fill-white" />
      )}
      <div className="my-1 mr-4 flex h-max min-w-max items-center justify-center rounded-full px-2 py-1">
        {!reorderingTodos && (
          <Select
            className="relative mr-2 flex h-6 w-[100px] rounded-lg bg-neutral-200 fill-neutral-700 text-xs text-neutral-700 hover:cursor-pointer dark:bg-neutral-700 dark:fill-neutral-200 dark:text-white"
            value={sortingOption}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSortingOption(e.currentTarget.value as SortingOption);
              if (sessionStorage.getItem("sort")) {
                sessionStorage.removeItem("sort");
              }
              sessionStorage.setItem("sort", e.currentTarget.value);
            }}
          >
            <>
              <option value="default">default</option>
              <option value="completed">completed</option>
              <option value="urgency">urgency</option>
              <option value="recent">recent</option>
            </>
          </Select>
        )}
        {sortingOption === "default" && (
          <>
            {!reorderingTodos ? (
              <CircleButton
                onClick={() => {
                  setReorderingTodos(true);
                }}
                info="reorder todos"
                className="h-6 w-6 hover:bg-cyan-400 dark:hover:bg-cyan-500"
              >
                <OpenWithIcon className="h-4 w-4" />
              </CircleButton>
            ) : (
              <>
                <CircleButton
                  onClick={cancelSortingButtonHandler}
                  info="cancel"
                  className="mr-1 h-6 w-6 bg-red-300 hover:bg-red-400  dark:bg-red-400 dark:hover:bg-red-500"
                >
                  <CloseIcon className="h-4 w-4" />
                </CircleButton>
                <CircleButton
                  onClick={applySortingButtonHandler}
                  info="apply"
                  className="mr-1 h-6 w-6 bg-emerald-300 hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-500"
                >
                  <CheckIcon className="h-4 w-4" />
                </CircleButton>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TodoControllers;

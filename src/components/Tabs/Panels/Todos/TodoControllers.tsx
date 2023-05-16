// React
import { useState, type Dispatch, type SetStateAction } from "react";

// components
import CircleButton from "@/components/Buttons/CircleButton";

// ICONS
import OpenWithIcon from "@mui/icons-material/OpenWith";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

// styles
import loader_styles from "@/styles/loader.module.css";

type TodoControllersProps = {
  sortingTodos: boolean;
  setSortingTodos: Dispatch<SetStateAction<boolean>>;
};

const TodoControllers = ({
  sortingTodos,
  setSortingTodos,
}: TodoControllersProps) => {
  const [isProceed, setIsProceed] = useState(false);

  return (
    <div className="flex h-max w-max items-center justify-center self-end">
      {isProceed && (
        <div className="mr-2 flex h-6 w-8 items-center justify-center">
          <span className={`ml-2 ${loader_styles.loader as string}`} />
        </div>
      )}
      <div className="my-4 mr-4 flex h-max min-w-max items-center justify-center rounded-full px-2 py-1">
        {!sortingTodos && (
          <select className="mx-2 rounded-xl bg-neutral-600 px-2 py-[3px] text-white outline-none hover:cursor-pointer">
            <option>sort</option>
          </select>
        )}
        {!sortingTodos ? (
          <CircleButton
            clickHandler={() => {
              setSortingTodos(true);
            }}
            info="switching mode"
            className="h-6 w-6"
          >
            <OpenWithIcon className="h-4 w-4" />
          </CircleButton>
        ) : (
          <>
            <CircleButton
              clickHandler={() => {
                setSortingTodos(false);
              }}
              info="cancel"
              className="mr-1 h-6 w-6"
            >
              <CloseIcon className="h-4 w-4" />
            </CircleButton>
            <CircleButton
              clickHandler={() => {
                setSortingTodos(false);
              }}
              info="cancel"
              className="mr-1 h-6 w-6"
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

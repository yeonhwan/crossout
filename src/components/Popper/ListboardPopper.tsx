// types
import { type Todo, type ListBoard } from "@prisma/client";
import { type ListboardItemType } from "@/types/client";

//components
import Button from "@/components/Buttons/Button";
import TodoItem from "@/components/Lists/Items/TodoItem";
import ListView from "@/components/Lists/ListView";
// libs
import ClickAwayListener from "@mui/base/ClickAwayListener";

type ListboardPopperProps = {
  isOpen: boolean;
  onTransitionEnd: () => void;
  popperClose: () => void;
  data: ListboardItemType | null;
};

const ListboardPopper = ({
  isOpen,
  onTransitionEnd,
  popperClose,
  data,
}: ListboardPopperProps) => {
  return (
    <div
      onTransitionEnd={onTransitionEnd}
      className={`absolute left-0 top-0 flex h-screen w-screen items-center justify-center transition-all duration-150 ${
        isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
      }`}
    >
      <ClickAwayListener
        onClickAway={() => {
          popperClose();
        }}
      >
        <div className="flex h-2/3 w-1/2 flex-col rounded-2xl bg-white">
          <Button
            onClick={() => {
              popperClose();
            }}
          >
            close
          </Button>
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default ListboardPopper;

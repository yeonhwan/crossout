// libs
import { ClickAwayListener } from "@mui/material";

// components
import Calendar from "@/components/Calendar/Calendar";
import CircleButton from "../Buttons/CircleButton";
import Button from "../Buttons/Button";

// Icons
import TodosIcon from "public/icons/todos.svg";
import DaylogIcon from "public/icons/daylog.svg";
import RevenueIcon from "public/icons/money_all.svg";
import LoadDetailIcon from "public/icons/load-detail.svg";
import CloseIcon from "@mui/icons-material/Close";

type CalendarPopperProps = {
  animateTrigger: boolean;
  handleTransition: () => void;
  closeCalendar: () => void;
};

const CalendarPopper = ({
  animateTrigger,
  handleTransition,
  closeCalendar,
}: CalendarPopperProps) => {
  const ButtonContainer = () => {
    return (
      <div className="flex h-max w-full justify-center">
        <CircleButton info="Todos" className="h-8 w-8 rounded-r-none">
          <TodosIcon fill="white" className="h-4 w-4" />
        </CircleButton>
        <CircleButton className="rounded-none" info="Daylogs">
          <DaylogIcon stroke="white" className="h-4 w-4" />
        </CircleButton>
        <CircleButton className="rounded-l-none" info="Revenues">
          <RevenueIcon className="h-4 w-4" />
        </CircleButton>
      </div>
    );
  };

  return (
    <ClickAwayListener onClickAway={closeCalendar}>
      <div
        onTransitionEnd={handleTransition}
        className={`absolute left-1/4 top-0 z-50 flex h-[90%] w-1/2 flex-col items-center justify-center rounded-xl bg-black/20 backdrop-blur-md transition-all duration-150 ${
          animateTrigger
            ? "translate-y-0 opacity-100"
            : "translate-y-40 opacity-0"
        }`}
      >
        <CircleButton className="absolute right-2 top-2 h-6 w-6">
          <CloseIcon className="h-4 w-4" />
        </CircleButton>
        <div className="flex h-full w-5/6 flex-col items-center justify-around py-6">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl font-bold text-white ">Calendar</p>
            <p className="text-lg text-white">2023 May 25th</p>
          </div>
          {ButtonContainer()}
          <Calendar />
          <span className="absolute right-20">
            <LoadDetailIcon className="h-5 w-5 animate-bounce fill-white" />
          </span>
          <Button className="text-sm">Move</Button>
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default CalendarPopper;

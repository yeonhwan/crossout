// components
import CircleButton from "@/components/Buttons/CircleButton";

// ICONS
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// libs
import { Tooltip } from "@mui/material";

// Hooks
import { useEffect } from "react";
import { useAnimate } from "framer-motion";

// store
import useDateStore from "@/stores/useDateStore";

// Props TYPE
type DateTimerProps = {
  openCalendar: () => void;
};

const DateTimer = ({ openCalendar }: DateTimerProps) => {
  const { dateObj, increaseDate, decreaseDate } = useDateStore(
    (state) => state
  );
  const year = dateObj.year;
  const month = dateObj.monthString;
  const date = dateObj.date;
  const day = dateObj.day;
  const [scope, animate] = useAnimate();

  const generateDateSub = (date: number): string => {
    switch (date) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";

      default:
        return "th";
    }
  };

  useEffect(() => {
    animate(scope.current, { opacity: [0, 100], y: [-10, 0] })
      .then(() => {
        return;
      })
      .catch(() => {
        return;
      });
    return;
  }, [dateObj]);

  return (
    <div className="flex h-full w-max items-center justify-center font-extrabold">
      <CircleButton
        className="mr-2 h-5 w-5 bg-neutral-600/60 hover:bg-neutral-300/60 dark:bg-white/60 dark:hover:bg-neutral-800/60 lg:h-6 lg:w-6"
        onClick={decreaseDate}
        info="yesterday"
      >
        <KeyboardArrowLeftIcon className="h-4 w-4 transition-none hover:fill-neutral-700 dark:fill-neutral-700 dark:hover:fill-neutral-200 lg:h-5 lg:w-5" />
      </CircleButton>
      <Tooltip title="Open Calendar" arrow placement="top">
        <div
          ref={scope}
          className="flex h-max w-max items-center transition-colors duration-75 hover:cursor-pointer hover:text-teal-400 dark:text-white dark:hover:text-teal-400"
          onClick={openCalendar}
        >
          <span className="mr-2 text-xs font-semibold lg:text-sm">{year}</span>
          <span className="mr-2 text-2xl lg:text-4xl">
            {`${month} ${date}`}
            <span className="text-sm font-semibold lg:text-lg">
              {generateDateSub(date)}
            </span>
          </span>
          <span className="text-md mr-2 font-bold lg:text-xl">{day}</span>
        </div>
      </Tooltip>
      <CircleButton
        className="ml-2 h-5 w-5 bg-neutral-500/60 transition-none hover:bg-neutral-300/60 dark:bg-white/60 dark:hover:bg-neutral-800/60 lg:h-6 lg:w-6"
        onClick={increaseDate}
        info="tomorrow"
      >
        <KeyboardArrowRightIcon className="h-4 w-4 transition-none hover:fill-neutral-700 dark:fill-neutral-700 dark:hover:fill-neutral-200 lg:h-5 lg:w-5" />
      </CircleButton>
    </div>
  );
};

export default DateTimer;

// components
import CircleButton from "@/components/Buttons/CircleButton";

// ICONS
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// libs
import { Tooltip } from "@mui/material";

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

  return (
    <div className="flex h-max w-max items-end text-4xl font-extrabold">
      <CircleButton
        className="mr-2 h-6 w-6 bg-neutral-600/60 hover:bg-neutral-300/60 dark:bg-white/60 dark:hover:bg-neutral-800/60"
        onClick={decreaseDate}
      >
        <KeyboardArrowLeftIcon className="transition-none hover:fill-neutral-700 dark:fill-neutral-700 dark:hover:fill-neutral-200" />
      </CircleButton>
      <Tooltip title="Open Calendar" arrow placement="top">
        <div
          className="flex h-max w-max items-center transition-colors duration-75 hover:cursor-pointer hover:text-neutral-200 dark:text-white dark:hover:text-neutral-800"
          onClick={openCalendar}
        >
          <span className="mr-2 text-lg font-semibold">{year}</span>
          <span className="mr-2">
            {`${month} ${date}`}
            <span className="text-base font-semibold">
              {generateDateSub(date)}
            </span>
          </span>
          <span className="mr-2 text-xl font-bold">{day}</span>
        </div>
      </Tooltip>
      <CircleButton
        className="ml-2 h-6 w-6 bg-neutral-500/60 transition-none hover:bg-neutral-300/60 dark:bg-white/60 dark:hover:bg-neutral-800/60"
        onClick={increaseDate}
      >
        <KeyboardArrowRightIcon className="transition-none hover:fill-neutral-700 dark:fill-neutral-700 dark:hover:fill-neutral-200" />
      </CircleButton>
    </div>
  );
};

export default DateTimer;

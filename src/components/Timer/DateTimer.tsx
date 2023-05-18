// components
import CircleButton from "@/components/Buttons/CircleButton";

// ICONS
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// store
import useDateStore from "@/stores/useDateStore";

// Props TYPE

const DateTimer = () => {
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
        className="mr-2 h-6 w-6 bg-neutral-500/60"
        onClick={decreaseDate}
      >
        <KeyboardArrowLeftIcon />
      </CircleButton>
      <span className="mr-2 text-lg font-semibold">{year}</span>
      <span className="mr-2">
        {`${month} ${date}`}
        <span className="text-base font-semibold">{generateDateSub(date)}</span>
      </span>
      <span className="mr-2 text-xl font-bold">{day}</span>
      <CircleButton
        className="ml-2 h-6 w-6 bg-neutral-500/60"
        onClick={increaseDate}
      >
        <KeyboardArrowRightIcon />
      </CircleButton>
    </div>
  );
};

export default DateTimer;

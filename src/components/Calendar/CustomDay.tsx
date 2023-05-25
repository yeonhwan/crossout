import { PickersDay, type PickersDayProps } from "@mui/x-date-pickers";
import dayjs, { type Dayjs } from "dayjs";

type CustomDayProps = {
  className?: string;
} & PickersDayProps<Dayjs>;

const CustomDay = ({ className, ...props }: CustomDayProps) => {
  const { day, outsideCurrentMonth, today, selected } = props;
  const showBadge = !outsideCurrentMonth;

  return (
    <div className="relative h-max w-max flex-col">
      <PickersDay
        className={`text-white ${selected ? "bg-emerald-400" : ""}`}
        {...props}
        style={{ border: today ? "1px dotted gray" : "0" }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
      {showBadge && (
        <span
          className={`absolute right-1 top-0 text-center text-[5px] font-semibold ${
            selected ? "text-white" : "text-emerald-300"
          }`}
        >
          4
        </span>
      )}
    </div>
  );
};

export default CustomDay;

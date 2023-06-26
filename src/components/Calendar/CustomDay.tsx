// libs
import { PickersDay, type PickersDayProps } from "@mui/x-date-pickers";
import { type Dayjs } from "dayjs";

// types
import type { MonthlyData } from "@/types/client";

// React, hooks

type CustomDayProps = {
  slotData?: MonthlyData;
  field?: "todo" | "revenue" | "daylog";
} & PickersDayProps<Dayjs>;

const CustomDay = (props: CustomDayProps) => {
  const {
    day,
    today,
    outsideCurrentMonth,
    selected,
    // custom props
    slotData,
    field,
    ...other
  } = props;

  if (!slotData) throw new Error("no slot data");

  if (field === "todo") {
    const curDayData = slotData.filter(
      (data) => data.date === day.get("date")
    )[0];
    const showBadge = !outsideCurrentMonth && curDayData;
    if (showBadge) {
      const { todos: count } = curDayData._count as { todos: number };

      return (
        <div className="relative h-max w-max flex-col">
          <PickersDay
            className={`text-neutral-600 dark:text-white ${
              selected ? "bg-emerald-400" : ""
            }`}
            {...other}
            day={day}
            today={today}
            outsideCurrentMonth={outsideCurrentMonth}
            selected={selected}
            style={{ border: today ? "1px dotted gray" : "0" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <span
            className={`absolute right-1 top-0 text-center text-[10px] font-semibold ${
              selected
                ? "text-white"
                : "animate-pulse text-emerald-600 dark:text-emerald-300"
            }`}
          >
            {count}
          </span>
        </div>
      );
    } else {
      return (
        <div className="relative h-max w-max flex-col">
          <PickersDay
            className={`text-neutral-600 dark:text-white ${
              selected ? "bg-emerald-300 dark:bg-emerald-400" : ""
            }`}
            day={day}
            today={today}
            outsideCurrentMonth={outsideCurrentMonth}
            selected={selected}
            {...other}
            style={{ border: today ? "1px dotted gray" : "0" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      );
    }
  }

  if (field === "daylog") {
    const curDayData = slotData.filter(
      (data) => data.date === day.get("date")
    )[0];
    const showBadge = !outsideCurrentMonth && curDayData;
    if (showBadge) {
      const mood = curDayData.daylogs?.mood;

      const bgColor =
        mood === "terrible"
          ? "bg-red-700"
          : mood === "bad"
          ? "bg-red-400"
          : mood === "normal"
          ? "bg-yellow-200"
          : mood === "good"
          ? "bg-emerald-300"
          : mood === "happy"
          ? "bg-cyan-300"
          : "";

      return (
        <div className="relative h-max w-max flex-col">
          <PickersDay
            className={`text-neutral-600 dark:text-white ${
              selected ? "bg-emerald-300 dark:bg-emerald-400" : ""
            }`}
            day={day}
            today={today}
            outsideCurrentMonth={outsideCurrentMonth}
            selected={selected}
            {...other}
            style={{ border: today ? "1px dotted gray" : "0" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <span
            className={`absolute ${bgColor} right-1 top-0 h-2 w-2 animate-pulse rounded-full text-center text-[5px] font-semibold ${
              selected ? "animate-none" : "animate-pulse"
            }`}
          ></span>
        </div>
      );
    } else {
      return (
        <div className="relative h-max w-max flex-col">
          <PickersDay
            className={`text-neutral-600 dark:text-white ${
              selected ? "bg-emerald-400" : ""
            }`}
            day={day}
            today={today}
            outsideCurrentMonth={outsideCurrentMonth}
            selected={selected}
            {...other}
            style={{ border: today ? "1px dotted gray" : "0" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      );
    }
  }

  if (field === "revenue") {
    const curDayData = slotData.filter(
      (data) => data.date === day.get("date")
    )[0];
    const showBadge = !outsideCurrentMonth && curDayData;

    if (showBadge) {
      const total = curDayData.revenues?.reduce(
        (acc, cur) => acc + Number(cur.revenue),
        0
      ) as number;

      const badgeRender = () => {
        if (total > 0) {
          return (
            <span
              className={`absolute right-1 top-0 text-center text-[10px] font-semibold ${
                selected
                  ? "text-white"
                  : "animate-pulse text-emerald-400 dark:text-emerald-300"
              }`}
            >
              +$
            </span>
          );
        } else {
          return (
            <span
              className={`absolute right-1 top-0 animate-pulse text-center text-[10px] font-semibold ${
                selected ? "text-white" : "text-red-400 dark:text-red-300"
              }`}
            >
              -$
            </span>
          );
        }
      };

      return (
        <div className="relative h-max w-max flex-col">
          <PickersDay
            className={`text-neutral-600 dark:text-white ${
              selected ? "bg-emerald-300 dark:bg-emerald-400" : ""
            }`}
            day={day}
            today={today}
            outsideCurrentMonth={outsideCurrentMonth}
            selected={selected}
            {...other}
            style={{ border: today ? "1px dotted gray" : "0" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          {badgeRender()}
        </div>
      );
    } else {
      return (
        <div className="relative h-max w-max flex-col">
          <PickersDay
            className={`text-neutral-600 dark:text-white ${
              selected ? "bg-emerald-400" : ""
            }`}
            day={day}
            today={today}
            outsideCurrentMonth={outsideCurrentMonth}
            selected={selected}
            {...other}
            style={{ border: today ? "1px dotted gray" : "0" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      );
    }
  }

  return <PickersDay {...props} />;
};

export default CustomDay;

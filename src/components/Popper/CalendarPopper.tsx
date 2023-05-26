// React, hooks
import { useState } from "react";

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

// libs
import { ClickAwayListener } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";

// api
import { api } from "@/utils/api";

// types
import type {
  MonthlyDaylogData,
  MonthlyRevenuesData,
  MonthlyTodosData,
} from "@/types/client";

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
  const [dateInput, setDateInput] = useState<Dayjs>(dayjs());
  const [revenuesData, setRevenuesData] = useState<MonthlyRevenuesData>([]);
  const [todosData, setTodosData] = useState<MonthlyTodosData>([]);
  const [daylogsData, setDaylogsData] = useState<MonthlyDaylogData>([]);
  const [field, setField] = useState<"todo" | "revenue" | "daylog">("todo");

  const year = dateInput.get("year");
  const month = dateInput.get("month") + 1;

  const { isLoading } = api.daterecord.getMonthlyData.useQuery(
    {
      data: {
        field,
      },
      dateObject: {
        year,
        month,
      },
    },
    {
      queryKey: [
        "daterecord.getMonthlyData",
        { data: { field }, dateObject: { year, month } },
      ],
      onSuccess: (res) => {
        const { data, field } = res;
        switch (field) {
          case "todo":
            setTodosData(data as MonthlyTodosData);
            return;
          case "daylog":
            setDaylogsData(data as MonthlyDaylogData);
            return;
          case "revenue":
            setRevenuesData(data as unknown as MonthlyRevenuesData);
            return;
          default:
            return;
        }
      },
      enabled: !!dateInput,
    }
  );

  const ButtonContainer = () => {
    return (
      <div className="flex h-max w-full justify-center">
        <CircleButton
          info="Todos"
          className={`h-8 w-8 rounded-r-none hover:bg-neutral-400 ${
            field === "todo" ? "pointer-events-none bg-emerald-400" : ""
          }`}
          onClick={() => {
            setField("todo");
          }}
        >
          <TodosIcon fill="white" className="h-4 w-4" />
        </CircleButton>
        <CircleButton
          className={`h-8 w-8 rounded-none hover:bg-neutral-400 ${
            field === "daylog" ? "pointer-events-none bg-emerald-400" : ""
          }`}
          info="Daylogs"
          onClick={() => {
            setField("daylog");
          }}
        >
          <DaylogIcon stroke="white" className="h-4 w-4" />
        </CircleButton>
        <CircleButton
          className={`h-8 w-8 rounded-l-none hover:bg-neutral-400 ${
            field === "revenue" ? "pointer-events-none bg-emerald-400" : ""
          }`}
          info="Revenues"
          onClick={() => {
            setField("revenue");
          }}
        >
          <RevenueIcon className="h-4 w-4" />
        </CircleButton>
      </div>
    );
  };

  return (
    <ClickAwayListener onClickAway={closeCalendar}>
      <div
        onTransitionEnd={handleTransition}
        className={`absolute left-1/4 top-10 z-50 flex h-[90%] w-1/2 flex-col items-center justify-center rounded-xl bg-black/20 backdrop-blur-md transition-all duration-150 ${
          animateTrigger
            ? "translate-y-0 opacity-100"
            : "translate-y-40 opacity-0"
        }`}
      >
        <CircleButton
          onClick={closeCalendar}
          className="absolute right-2 top-2 h-6 w-6"
        >
          <CloseIcon className="h-4 w-4" />
        </CircleButton>
        <div className="flex h-full w-5/6 flex-col items-center justify-around py-6">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl font-bold text-white ">Calendar</p>
            <p className="text-lg text-white">2023 May 25th</p>
          </div>
          {ButtonContainer()}
          <Calendar
            loading={isLoading}
            dateInput={dateInput}
            setDateInput={setDateInput}
            slotData={
              field === "revenue"
                ? revenuesData
                : field === "daylog"
                ? daylogsData
                : todosData
            }
            field={field}
          />
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

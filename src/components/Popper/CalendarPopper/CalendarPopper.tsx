// React, hooks
import { useState } from "react";

// components
import Calendar from "@/components/Calendar/Calendar";
import CircleButton from "../../Buttons/CircleButton";
import Button from "../../Buttons/Button";
import SelectedDataView from "./SelectedDataView/SelectedDataView";

// Icons
import TodosIcon from "public/icons/todos.svg";
import DaylogIcon from "public/icons/daylog.svg";
import RevenueIcon from "public/icons/money_all.svg";
import LoadDetailIcon from "public/icons/load-detail.svg";
import CloseIcon from "@mui/icons-material/Close";

// libs
import { ClickAwayListener } from "@mui/material";
import { type Dayjs } from "dayjs";

// api
import { api } from "@/utils/api";

// types
import type { MonthlyData, SelectedDateDateType } from "@/types/client";

// stroe
import useDateStore from "@/stores/useDateStore";

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
  const { setDateObj, dateObj } = useDateStore((state) => state);
  const [dateInput, setDateInput] = useState<Dayjs>(dateObj.now);
  const [revenuesData, setRevenuesData] = useState<MonthlyData>([]);
  const [todosData, setTodosData] = useState<MonthlyData>([]);
  const [daylogsData, setDaylogsData] = useState<MonthlyData>([]);
  const [field, setField] = useState<"todo" | "revenue" | "daylog">("todo");
  const [selectedDateData, setSelectedDateData] =
    useState<SelectedDateDateType>();
  const [showDetail, setShowDetail] = useState(false);

  const nowDate = dateInput.get("date");
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
            setTodosData(data as MonthlyData);
            const selectedDataTodos = (data as MonthlyData).find(
              (data) => data.date === nowDate
            );
            setSelectedDateData(selectedDataTodos);
            return;
          case "daylog":
            setDaylogsData(data as MonthlyData);
            const selectedDataDaylog = (data as MonthlyData).find(
              (data) => data.date === nowDate
            );
            setSelectedDateData(selectedDataDaylog);
            return;
          case "revenue":
            setRevenuesData(data as unknown as MonthlyData);
            const selectedDataRevenue = (data as MonthlyData).find(
              (data) => data.date === nowDate
            );
            setSelectedDateData(selectedDataRevenue);
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
      <div className="flex h-max w-full justify-center drop-shadow-md">
        <CircleButton
          info="Todos"
          className={`h-10 w-10 rounded-r-none hover:bg-neutral-400 ${
            field === "todo" ? "pointer-events-none bg-emerald-400" : ""
          }`}
          onClick={() => {
            setField("todo");
          }}
        >
          <TodosIcon fill="white" className="h-4 w-4" />
        </CircleButton>
        <CircleButton
          className={`h-10 w-10 rounded-none hover:bg-neutral-400 ${
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
          className={`h-10 w-10 rounded-l-none hover:bg-neutral-400 ${
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
        <div className="relative flex h-full w-5/6 flex-col justify-around overflow-hidden py-6">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl font-bold text-white ">Calendar</p>
            <p
              className={`w-full text-center text-lg ${
                selectedDateData ? "font-semibold text-cyan-400" : "text-white"
              }`}
            >
              {dateInput.format("YYYY MMM DD ddd")}
            </p>
          </div>
          <div
            className={`flex h-full w-[200%] transition-transform duration-200 ${
              showDetail ? "translate-x-[-50%]" : "translate-x-0"
            }`}
          >
            <div className={`flex h-full w-1/2 flex-col justify-start py-8`}>
              <div className="flex h-[90%] w-full flex-col justify-evenly">
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
                  setSelectedData={setSelectedDateData}
                />
              </div>
            </div>
            <SelectedDataView
              closeShowDetail={() => {
                setShowDetail(false);
              }}
              showDetail={showDetail}
              currentData={selectedDateData}
              field={field}
            />
          </div>
          {!showDetail && selectedDateData && (
            <span
              onClick={() => {
                setShowDetail(true);
              }}
              className="absolute right-0 top-1/2 my-2 flex h-8 w-8 rotate-180 animate-pulse items-center justify-center rounded-full hover:animate-none hover:cursor-pointer hover:bg-neutral-400/40"
            >
              <LoadDetailIcon className="h-4 w-4 fill-white" />
            </span>
          )}
          <Button
            onClick={() => {
              setDateObj({ now: dateInput });
              closeCalendar();
            }}
            className="self-center text-sm"
          >
            Move
          </Button>
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default CalendarPopper;
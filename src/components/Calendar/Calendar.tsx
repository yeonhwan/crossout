// components
import CustomDay from "@/components/Calendar/CustomDay";

// libs
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";

// types
import type { Dispatch, SetStateAction } from "react";
import type { SelectedDateDateType, MonthlyData } from "@/types/client";
import type { PickerSelectionState } from "@mui/x-date-pickers/internals";
import type { MuiPickersAdapter } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";

type dateAdapter = new (...args: any) => MuiPickersAdapter<Dayjs, string>;

type CalendarProps = {
  dateInput: Dayjs | null;
  setDateInput: Dispatch<SetStateAction<Dayjs>>;
  loading: boolean;
  slotData: MonthlyData;
  field: "todo" | "revenue" | "daylog";
  setSelectedData: Dispatch<SetStateAction<SelectedDateDateType | undefined>>;
};

const Calendar = ({
  dateInput,
  setDateInput,
  loading,
  slotData,
  field,
  setSelectedData,
}: CalendarProps) => {
  const onChangeHandler = (
    value: Dayjs | null,
    selectionState: PickerSelectionState | undefined
  ) => {
    if (selectionState === "finish" && value) {
      setDateInput(value);
      const curDayData = slotData.filter(
        (data) => data.date === value.get("date")
      )[0];
      setSelectedData(curDayData);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs as dateAdapter}>
      <DateCalendar
        loading={loading}
        className="h-full max-h-[350px] rounded-xl border-2 border-neutral-500 bg-neutral-200 text-neutral-600 drop-shadow-lg dark:border-neutral-300 dark:bg-neutral-700 dark:text-white"
        value={dateInput}
        renderLoading={() => <DayCalendarSkeleton />}
        onChange={onChangeHandler}
        onMonthChange={(date) => {
          setDateInput(date);
        }}
        onYearChange={(date) => {
          setDateInput(date);
        }}
        slots={{ day: CustomDay }}
        sx={{
          ".MuiDayCalendar-weekDayLabel": {
            color: document.querySelector(".layout")?.classList.contains("dark")
              ? "white"
              : "black",
            fontWeight: "bold",
          },
          ".MuiSvgIcon-root": {
            color: document.querySelector(".layout")?.classList.contains("dark")
              ? "white"
              : "black",
          },
          ".MuiDayCalendar-monthContainer": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          },
          ".MuiPickersDay-today": {
            border: "1px solid gray",
          },
        }}
        slotProps={{
          day: {
            slotData,
            field,
          } as object,
        }}
      />
    </LocalizationProvider>
  );
};

export default Calendar;

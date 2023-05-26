// libs
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { type MuiPickersAdapter } from "@mui/x-date-pickers";
import { type Dayjs } from "dayjs";
import CustomDay from "@/components/Calendar/CustomDay";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";

// types
import { type Dispatch, type SetStateAction } from "react";
import type {
  MonthlyDaylogData,
  MonthlyRevenuesData,
  MonthlyTodosData,
} from "@/types/client";

type dateAdapter = new (...args: any) => MuiPickersAdapter<Dayjs, string>;

type CalendarProps = {
  dateInput: Dayjs | null;
  setDateInput: Dispatch<SetStateAction<Dayjs>>;
  loading: boolean;
  slotData: MonthlyDaylogData | MonthlyRevenuesData | MonthlyTodosData;
  field: "todo" | "revenue" | "daylog";
};

const Calendar = ({
  dateInput,
  setDateInput,
  loading,
  slotData,
  field,
}: CalendarProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs as dateAdapter}>
      <DateCalendar
        loading={loading}
        className="h-full max-h-[350px] rounded-xl border-2 border-neutral-300 bg-neutral-700 text-white drop-shadow-lg"
        value={dateInput}
        renderLoading={() => <DayCalendarSkeleton />}
        onChange={(value, selectionState) => {
          if (selectionState === "finish" && value) {
            setDateInput(value);
          }
        }}
        onMonthChange={(date) => {
          setDateInput(date);
        }}
        onYearChange={(date) => {
          setDateInput(date);
        }}
        sx={{
          ".MuiDayCalendar-weekDayLabel": {
            color: "white",
            fontWeight: "bold",
          },
          ".MuiSvgIcon-root": {
            color: "white",
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
        slots={{ day: CustomDay }}
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

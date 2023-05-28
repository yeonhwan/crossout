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
import type { SelectedDateDateType, MonthlyData } from "@/types/client";
import { type PickerSelectionState } from "@mui/x-date-pickers/internals";

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
        className="h-full max-h-[350px] rounded-xl border-2 border-neutral-300 bg-neutral-700 text-white drop-shadow-lg"
        value={dateInput}
        renderLoading={() => <DayCalendarSkeleton />}
        onChange={onChangeHandler}
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

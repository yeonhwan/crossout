import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { type MuiPickersAdapter } from "@mui/x-date-pickers";
import dayjs, { type Dayjs } from "dayjs";
import CustomDay from "@/components/Calendar/CustomDay";
import { useState } from "react";

type dateAdapter = new (...args: any) => MuiPickersAdapter<Dayjs, string>;

const Calendar = () => {
  const [dateInput, setDateInput] = useState<Dayjs | null>(dayjs());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs as dateAdapter}>
      <DateCalendar
        className="h-full max-h-[350px] rounded-xl border-2 border-neutral-300 bg-neutral-700 text-white drop-shadow-lg"
        value={dateInput}
        onChange={(date, selectionState) => {
          if (selectionState) {
            setDateInput(date);
          }
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
      />
    </LocalizationProvider>
  );
};

export default Calendar;

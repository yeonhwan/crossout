// libs
import { ClickAwayListener } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar, type MuiPickersAdapter } from "@mui/x-date-pickers";
import { type Dayjs } from "dayjs";

// hooks
import { type Dispatch, type SetStateAction } from "react";

type dateAdapter = new (...args: any) => MuiPickersAdapter<Dayjs, string>;

type ChartCalendarPopperProps = {
  animateTrigger: boolean;
  handleTransition: () => void;
  closeCalendar: () => void;
  dateInput: Dayjs;
  setDateInput: Dispatch<SetStateAction<Dayjs>>;
  setIsInitialLoad: Dispatch<SetStateAction<boolean>>;
  isInitialLoad: boolean;
};

const ChartCalenderPopper = ({
  animateTrigger,
  handleTransition,
  closeCalendar,
  dateInput,
  setDateInput,
  setIsInitialLoad,
  isInitialLoad,
}: ChartCalendarPopperProps) => {
  return (
    <ClickAwayListener onClickAway={closeCalendar}>
      <div
        onTransitionEnd={handleTransition}
        className={`absolute left-0 top-6 z-50 flex h-32 w-[250px] rounded-xl border-2 border-white/30 bg-neutral-700 text-white transition-all duration-150 ${
          animateTrigger
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-[-50px] opacity-0"
        }`}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs as dateAdapter}>
          <DateCalendar
            className="w-[230px] justify-center"
            view="year"
            views={["year"]}
            sx={{ ".MuiYearCalendar-root": { width: 230 } }}
            value={dateInput}
            onChange={(value) => {
              if (value) {
                setDateInput(value);
                closeCalendar();
                if (isInitialLoad) setIsInitialLoad(false);
              }
            }}
          />
        </LocalizationProvider>
      </div>
    </ClickAwayListener>
  );
};

export default ChartCalenderPopper;

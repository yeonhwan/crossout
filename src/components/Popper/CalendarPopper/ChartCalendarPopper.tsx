// libs
import { ClickAwayListener } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { type MuiPickersAdapter } from "@mui/x-date-pickers";
import { type Dayjs } from "dayjs";

// hooks
import { useState, type Dispatch, type SetStateAction } from "react";

// Components
import Button from "@/components/Buttons/Button";

type dateAdapter = new (...args: any) => MuiPickersAdapter<Dayjs, string>;

type ChartCalendarPopperProps = {
  animateTrigger: boolean;
  handleTransition: () => void;
  closeCalendar: () => void;
  dateInput: Dayjs;
  setDateInput: Dispatch<SetStateAction<Dayjs>>;
  setDefaultDateInput: () => void;
};

const ChartCalenderPopper = ({
  animateTrigger,
  handleTransition,
  closeCalendar,
  dateInput,
  setDateInput,
  setDefaultDateInput,
}: ChartCalendarPopperProps) => {
  const [mode, setMode] = useState<"month" | "year">("year");

  return (
    <ClickAwayListener onClickAway={closeCalendar}>
      <div
        onTransitionEnd={handleTransition}
        className={`absolute left-1/4 top-0 z-50 flex h-[50%] w-1/2 flex-col items-center justify-center rounded-xl bg-white/20 backdrop-blur-md transition-all duration-150 ${
          animateTrigger
            ? "translate-y-0 opacity-100"
            : "translate-y-40 opacity-0"
        }`}
      >
        <p className="font-lg mb-2 font-semibold text-white">
          Select year / month to show statistic data
        </p>
        <div className="flex">
          <Button
            className="px-2 py-1 text-xs"
            onClick={() => {
              setMode("year");
            }}
          >
            Yearly
          </Button>
          <Button
            className="px-2 py-1 text-xs"
            onClick={() => {
              setMode("month");
            }}
          >
            Monthly
          </Button>
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs as dateAdapter}>
          {mode === "month" ? (
            <DatePicker
              label={'"month" and "year"'}
              views={["month", "year"]}
              sx={{
                ".MuiInputBase-root": { color: "white" },
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                  color: "white",
                },
                legend: { color: "white" },
              }}
              value={dateInput}
              onChange={(value, ctx) => {
                if (!ctx.validationError && value) {
                  setDateInput(value);
                }
              }}
            />
          ) : (
            <DatePicker
              label={'"year"'}
              openTo="year"
              views={["year"]}
              sx={{
                ".MuiInputBase-root": { color: "white" },
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                  color: "white",
                },
                legend: { color: "white" },
              }}
              value={dateInput}
              onChange={(value, ctx) => {
                if (!ctx.validationError && value) {
                  setDateInput(value);
                }
              }}
            />
          )}
        </LocalizationProvider>
        <div className="flex">
          <Button>Select</Button>
          <Button
            onClick={() => {
              closeCalendar();
              setDefaultDateInput();
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default ChartCalenderPopper;

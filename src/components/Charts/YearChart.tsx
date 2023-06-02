import { type CalendarTooltipProps, ResponsiveTimeRange } from "@nivo/calendar";

type YearChartProps = {
  data:
    | {
        day: string;
        value: number;
        completed: number;
      }[]
    | {
        day: string;
        totalCount: number;
        earnCount: number;
        value: number;
      }[]
    | {
        day: string;
        value: number;
      }[];
  selectedField: "todo" | "revenue" | "mood";
};

const YearChart = ({ data, selectedField }: YearChartProps) => {
  const todosColors = ["#73a293d2", "#86a8a2", "#0fc0a34e", "#09b094"];
  const revenuesColors = [
    "#7f1515d2",
    "#ac3636",
    "#e98282",
    "#f4b6b6a8",
    "#85ba97",
    "#4bcf84e4",
    "#02af4d",
  ];
  const moodColors = [
    "#922020d2",
    "#c76954",
    "#d6cd1cc7",
    "#0ff08e",
    "#00bcca",
  ];
  const revenuesTicks = [-1000, -500, -100, 0, 100, 500, 1000];
  const moodsTicks = [1, 2, 3, 4, 5];

  const revenueColorScale = (value: number | { valueOf(): number }) => {
    if (value === 0) return "#b3b3b3";
    for (let i = 0; i < revenuesTicks.length; i++) {
      if (value <= (revenuesTicks[i] as number)) {
        return revenuesColors[i] as string;
      }
    }
    return "#02af4d";
  };

  const moodColorScale = (value: number | { valueOf(): number }) => {
    return moodColors[(value as number) - 1] as string;
  };

  revenueColorScale.ticks = () => revenuesTicks;
  moodColorScale.ticks = () => moodsTicks;

  const todoTooltip = ({ day, value }: CalendarTooltipProps) => {
    return (
      <div className="flex items-center justify-center rounded-lg bg-neutral-500 p-2 text-white">
        <span className="mx-1 text-xs font-semibold">{day}</span>
        <span className="mx-1 text-sm font-bold text-cyan-300">
          {value} todos
        </span>
      </div>
    );
  };

  const revenueTooltip = ({ day, value }: CalendarTooltipProps) => {
    const revenue = Number(value);
    return (
      <div className="flex items-center justify-center rounded-lg bg-neutral-500 p-2 text-white">
        <span className="mx-1 text-xs font-semibold">{day}</span>
        <span
          className={`mx-1 text-sm font-bold ${
            revenue > 0 ? "text-emerald-400" : revenue < 0 ? "text-red-400" : ""
          }`}
        >
          {value}$
        </span>
      </div>
    );
  };

  const moodTooltip = ({ day, value }: CalendarTooltipProps) => {
    const numValue = Number(value);
    const mood =
      numValue === 1
        ? "terrible"
        : numValue === 2
        ? "bad"
        : numValue === 3
        ? "normal"
        : numValue === 4
        ? "good"
        : "happy";
    return (
      <div className="flex items-center justify-center rounded-lg bg-neutral-500 p-2 text-white">
        <span className="mx-1 text-xs font-semibold">{day}</span>
        <span
          className={`mx-1 text-sm font-bold ${
            numValue === 1
              ? "text-red-500"
              : numValue === 2
              ? "text-red-300"
              : numValue === 3
              ? "text-yellow-300"
              : numValue === 4
              ? "text-emerald-400"
              : "text-cyan-500"
          }`}
        >
          {mood}
        </span>
      </div>
    );
  };

  return (
    <div className="relative flex h-full w-full min-w-[800px] max-w-[1000px]">
      <ResponsiveTimeRange
        data={data}
        from="2023/01/01"
        to="2024/01/01"
        emptyColor="#585858d2"
        colors={selectedField === "todo" ? todosColors : undefined}
        colorScale={
          selectedField === "revenue"
            ? revenueColorScale
            : selectedField === "mood"
            ? moodColorScale
            : undefined
        }
        margin={{ top: 100, right: 50, bottom: 20, left: 20 }}
        dayBorderWidth={0}
        dayRadius={2}
        daySpacing={3}
        tooltip={
          selectedField === "revenue"
            ? revenueTooltip
            : selectedField === "mood"
            ? moodTooltip
            : todoTooltip
        }
        theme={{
          textColor: "white",
          fontSize: 12,
        }}
      />
      <div className="absolute bottom-1/4 left-24 flex w-max text-white">
        <legend className="text-xs">less</legend>
        <div className="flex w-12 items-center justify-evenly">
          <span className="h-2 w-2 rounded-lg bg-[#585858d2]"></span>
          <span className="h-2 w-2 rounded-lg bg-[#627f79]"></span>
          <span className="h-2 w-2 rounded-lg bg-[#5ebdad98]"></span>
          <span className="h-2 w-2 rounded-lg bg-[#09b094]"></span>
        </div>
        <legend className="text-xs">more</legend>
      </div>
    </div>
  );
};

export default YearChart;

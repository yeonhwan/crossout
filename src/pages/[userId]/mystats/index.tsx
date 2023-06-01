// components
import Button from "@/components/Buttons/Button";
import DoughnutChart from "@/components/Charts/DoughnutChart";
import YearChart from "@/components/Charts/YearChart";
import MonthChart from "@/components/Charts/MonthChart";

const Mystats = () => {
  return (
    <div className="flex h-full w-full flex-col px-28">
      <h1 className="text-4xl font-extrabold text-neutral-300">My Stats</h1>
      <p className="text-lg font-semibold text-neutral-700">
        See your daily life in total with monthly, weekly view in here!
      </p>
      <div className="mt-4 flex h-[80%] max-h-[600px] w-full justify-evenly rounded-xl bg-neutral-800/40 p-6 backdrop-blur-md">
        <div className="relative flex h-full w-[20%] flex-col justify-between rounded-xl">
          <div className="flex h-max w-full flex-col items-center justify-between">
            <select className="h-6 rounded-xl bg-neutral-700 text-center text-xs text-white hover:cursor-pointer">
              category
              <option>todos</option>
              <option>mood</option>
              <option>revenues</option>
            </select>
            <Button>Year</Button>
          </div>
          <div className="flex h-[55%] w-full items-center justify-center rounded-xl bg-neutral-400/30 p-4 shadow-lg">
            <DoughnutChart />
          </div>
          <div className="flex h-[25%] w-full flex-col items-center justify-center rounded-xl bg-neutral-400/30 shadow-lg">
            <p className="w-2/3 text-xl font-bold text-white">
              <span className="mr-2 text-sm font-semibold">Total:</span>
              30
            </p>
            <p className="w-2/3 text-lg font-bold text-white">
              <span className="mr-2 text-sm font-semibold">Completed:</span>
              70%
            </p>
          </div>
        </div>
        <div className="flex h-full w-[75%] flex-col justify-between px-4">
          <div className="flex h-[60%] w-full overflow-x-scroll rounded-xl bg-neutral-700 shadow-lg lg:items-center lg:justify-center">
            <YearChart />
            {/* <MonthChart /> */}
          </div>
          <div className="flex h-[35%] w-full justify-between">
            <div className="flex h-full w-[23%] flex-col items-center justify-center rounded-xl bg-neutral-300 shadow-lg">
              <p className="font-bold">Most Busy Day</p>
              <p className="font-semibold">2023 05 03</p>
            </div>
            <div className="flex h-full w-[23%] rounded-xl bg-neutral-300 shadow-lg"></div>
            <div className="flex h-full w-[23%] rounded-xl bg-neutral-300 shadow-lg"></div>
            <div className="flex h-full w-[23%] rounded-xl bg-neutral-300 shadow-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mystats;

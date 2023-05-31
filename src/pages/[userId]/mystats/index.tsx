// components
import Button from "@/components/Buttons/Button";

const Mystats = () => {
  return (
    <div className="flex h-full w-full flex-col px-28">
      <h1 className="text-4xl font-extrabold text-neutral-300">My Stats</h1>
      <p className="text-lg font-semibold text-neutral-700">
        See your daily life in total with monthly, weekly view in here!
      </p>
      <div className="mt-4 flex h-[80%] max-h-[600px] w-full justify-evenly rounded-xl bg-neutral-800/40 p-6 backdrop-blur-md">
        <div className="relative flex h-full w-[20%] flex-col justify-between rounded-xl">
          <div className="flex h-[15%] w-full flex-col items-center justify-evenly">
            <div className="flex w-full justify-center">
              <select className="h-6 rounded-xl bg-neutral-700 text-center text-xs text-white hover:cursor-pointer">
                category
                <option>todos</option>
                <option>mood</option>
                <option>revenues</option>
              </select>
              <Button className="rounded-md bg-neutral-800/50 py-1 text-xs">
                Month
              </Button>
              <Button className="rounded-md bg-emerald-500/40 py-1 text-xs">
                Week
              </Button>
            </div>
            <p className="self-center rounded-lg bg-neutral-800/80 p-1 px-2 text-xs text-emerald-300">
              2023-05-21 ~ 27
            </p>
          </div>
          <div className="flex h-[55%] w-full items-center justify-center rounded-xl bg-neutral-400/30 p-4">
            <div className="flex h-52 w-52 justify-center rounded-full bg-neutral-500"></div>
          </div>
          <div className="flex h-[25%] w-full flex-col items-center justify-center rounded-xl bg-neutral-400/30">
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
        <div className="flex h-full w-[50%] items-center justify-center rounded-xl bg-neutral-400/30"></div>
        <div className="flex h-full max-h-[500px] w-[25%] flex-col justify-evenly rounded-xl bg-neutral-400/30 p-4">
          <div className="flex h-20 w-full items-center justify-center rounded-2xl bg-neutral-100/40">
            <span className="font-bold text-white">Most Todos date</span>
          </div>
          <div className="flex h-20 w-full items-center justify-center rounded-2xl bg-neutral-100/40">
            <span className="font-bold text-white">Most Todos date</span>
          </div>
          <div className="flex h-20 w-full items-center justify-center rounded-2xl bg-neutral-100/40">
            <span className="font-bold text-white">Most Todos date</span>
          </div>
          <div className="flex h-20 w-full items-center justify-center rounded-2xl bg-neutral-100/40">
            <span className="font-bold text-white">Most Todos date</span>
          </div>
          <div className="flex h-20 w-full items-center justify-center rounded-2xl bg-neutral-100/40">
            <span className="font-bold text-white">Most Todos date</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mystats;

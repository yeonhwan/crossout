// components
import CircleButton from "@/components/Buttons/CircleButton";
import ListView from "@/components/Lists/ListView";
import RevenueItem from "@/components/Lists/Items/RevenueItem";

// ICONS
import MoneyAllIcon from "public/icons/money_all.svg";
import MoneyPlusIcon from "public/icons/money_plus.svg";
import MoneyMinusIcon from "public/icons/money_minus.svg";
import AddMoneyIcon from "public/icons/add_money.svg";

const dummyDataPlus = {
  purpose: "sallery",
  spentOrEarn: 10000,
};
const dummyDataMinus = {
  purpose: "for shopping",
  spentOrEarn: -10000,
};

type RevenuePanelProps = {
  openCreateRevenue: () => void;
};

const RevenuePanel = ({ openCreateRevenue }: RevenuePanelProps) => {
  return (
    <div className="mt-4 flex h-[90%] max-h-[500px] w-3/5 flex-col justify-center rounded-lg bg-neutral-400/40 p-6 backdrop-blur-sm">
      <div className="flex h-full w-full justify-around">
        <div className="relative flex h-[65%] w-1/6 flex-col items-center justify-between self-center">
          <div className="mt-2 flex h-[80%] w-full flex-col items-center justify-between rounded-xl bg-neutral-600/40 py-4">
            <CircleButton
              className="hover:bg-cyan-500"
              infoPlace="left"
              info="All"
            >
              <MoneyAllIcon className="h-6 w-6" />
            </CircleButton>
            <CircleButton infoPlace="left" info="Surplus">
              <MoneyPlusIcon className="h-6 w-6" />
            </CircleButton>
            <CircleButton
              className="hover:bg-red-400"
              infoPlace="left"
              info="Deficit"
            >
              <MoneyMinusIcon className="h-6 w-6" />
            </CircleButton>
          </div>
          <CircleButton
            info="Add Record"
            infoPlace="bottom"
            className="mt-2 flex h-10 w-10 items-center justify-center"
            onClick={openCreateRevenue}
          >
            <AddMoneyIcon className="h-6 w-6" />
          </CircleButton>
          <div className="mt-2 flex flex-col items-center justify-center">
            <p className="text-sm font-bold">Total</p>
            <p className="text-sm font-semibold">+ $35,000</p>
          </div>
        </div>
        <div className="flex w-3/4 flex-col items-center justify-around">
          <div className="flex h-[45%] w-full overflow-y-scroll rounded-xl bg-emerald-300/40 p-2">
            <ListView className="px-6 py-4">
              <RevenueItem data={dummyDataPlus} />
              <RevenueItem data={dummyDataPlus} />
              <RevenueItem data={dummyDataPlus} />
              <RevenueItem data={dummyDataPlus} />
            </ListView>
          </div>
          <div className="h-[1px] w-[90%] border-b-2 border-dotted border-b-neutral-600 "></div>
          <div className="felx h-[45%] w-full overflow-y-scroll rounded-xl bg-red-300/40 p-2">
            <ListView className="px-6 py-4">
              <RevenueItem data={dummyDataMinus} />
              <RevenueItem data={dummyDataMinus} />
              <RevenueItem data={dummyDataMinus} />
              <RevenueItem data={dummyDataMinus} />
            </ListView>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenuePanel;

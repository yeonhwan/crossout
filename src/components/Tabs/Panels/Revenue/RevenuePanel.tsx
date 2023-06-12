// Hooks
import { useState } from "react";

// components
import CircleButton from "@/components/Buttons/CircleButton";
import ListView from "@/components/Lists/ListView";
import RevenueItem from "@/components/Lists/Items/RevenueItem";
import NoRevenus from "@/components/Graphic/NoRevenues";

// ICONS
import MoneyAllIcon from "public/icons/money_all.svg";
import MoneyPlusIcon from "public/icons/money_plus.svg";
import MoneyMinusIcon from "public/icons/money_minus.svg";
import AddMoneyIcon from "public/icons/add_money.svg";

// api
import { api } from "@/utils/api";

// store
import useDateStore from "@/stores/useDateStore";

// type
import { type RevenueClient } from "@/types/client";

// utils
import { currencyFormatter } from "@/utils/currencyFormatter";

type RevenuePanelProps = {
  openCreateRevenue: () => void;
};

const RevenuePanel = ({ openCreateRevenue }: RevenuePanelProps) => {
  const [profitData, setProfitData] = useState<RevenueClient[]>([]);
  const [lossData, setLossData] = useState<RevenueClient[]>([]);
  const [total, setTotal] = useState("");
  const [viewAll, setViewAll] = useState(true);
  const [viewProfit, setViewProfit] = useState(false);
  const [viewLoss, setViewLoss] = useState(false);
  const { dateObj } = useDateStore((state) => state);

  api.revenue.getRevenues.useQuery(
    {
      dateObj,
    },
    {
      queryKey: ["revenue.getRevenues", { dateObj }],
      onSuccess: (res) => {
        const { data } = res;
        if (data) {
          const total = data.reduce((acc, cur) => acc + Number(cur.revenue), 0);
          const profitData = data.filter((data) => Number(data.revenue) >= 0);
          const lossData = data.filter((data) => Number(data.revenue) < 0);
          setProfitData(profitData);
          setLossData(lossData);
          setTotal(currencyFormatter(total));
        }
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  return (
    <div className="mt-4 flex h-[90%] max-h-[500px] w-3/5 flex-col justify-center rounded-lg bg-neutral-300/40 p-6 backdrop-blur-sm transition-colors dark:bg-neutral-800/40">
      <div className="flex h-full w-full justify-around">
        <div className="relative flex h-[65%] w-1/6 flex-col items-center justify-between self-center">
          <div className="mt-2 flex h-[80%] w-full flex-col items-center justify-between rounded-xl bg-neutral-300/60 py-4 transition-colors dark:bg-neutral-600/40">
            <CircleButton
              className={`hover:bg-cyan-400 dark:hover:bg-cyan-500 ${
                viewAll
                  ? "pointer-events-none bg-cyan-400 dark:bg-cyan-500"
                  : ""
              }`}
              infoPlace="left"
              info="All"
              onClick={() => {
                setViewAll(true);
                setViewProfit(false);
                setViewLoss(false);
              }}
            >
              <MoneyAllIcon className="h-6 w-6" />
            </CircleButton>
            <CircleButton
              className={`${
                viewProfit
                  ? "pointer-events-none bg-emerald-400 dark:bg-emerald-500"
                  : ""
              }`}
              infoPlace="left"
              info="Profit"
              onClick={() => {
                setViewProfit(true);
                setViewAll(false);
                setViewLoss(false);
              }}
            >
              <MoneyPlusIcon className="h-6 w-6" />
            </CircleButton>
            <CircleButton
              className={`hover:bg-red-500 ${
                viewLoss ? "pointer-events-none bg-red-500 dark:bg-red-500" : ""
              }`}
              infoPlace="left"
              info="Loss"
              onClick={() => {
                setViewLoss(true);
                setViewAll(false);
                setViewProfit(false);
              }}
            >
              <MoneyMinusIcon className="h-6 w-6" />
            </CircleButton>
          </div>
          <CircleButton
            info="Add Record"
            infoPlace="bottom"
            className="mt-2 flex h-10 w-10 items-center justify-center hover:bg-cyan-400 dark:hover:bg-cyan-500"
            onClick={openCreateRevenue}
          >
            <AddMoneyIcon className="h-6 w-6" />
          </CircleButton>
          <div className="mt-2 flex flex-col items-center justify-center">
            <p className="text-sm font-bold text-white">Total</p>
            <p
              className={`text-sm font-semibold ${
                total.includes("-")
                  ? "text-red-700 dark:text-red-300"
                  : "text-emerald-700 dark:text-emerald-300"
              }`}
            >
              {total}
            </p>
          </div>
        </div>
        <div className="flex w-3/4 flex-col items-center justify-around">
          <div
            className={`flex w-full overflow-y-scroll rounded-xl bg-emerald-400/50 p-2 transition-all delay-[100] duration-200 dark:bg-emerald-300/50 ${
              viewProfit
                ? "h-full"
                : viewLoss
                ? "h-0 overflow-hidden opacity-0"
                : "h-[45%]"
            }`}
          >
            {profitData.length ? (
              <ListView className="px-6 py-4">
                {profitData.map((data) => (
                  <RevenueItem data={data} key={data.id} />
                ))}
              </ListView>
            ) : (
              <NoRevenus color="green" />
            )}
          </div>
          {viewAll && (
            <div className="h-[1px] w-[90%] border-b-2 border-dotted border-b-neutral-600 dark:border-b-neutral-200 " />
          )}
          <div
            className={`flex w-full overflow-y-scroll rounded-xl bg-red-400/50 p-2 transition-all delay-[100] duration-200 dark:bg-red-300/50 ${
              viewLoss
                ? "h-full"
                : viewProfit
                ? "h-0 overflow-hidden opacity-0"
                : "h-[45%]"
            }`}
          >
            {lossData.length ? (
              <ListView className="px-6 py-4">
                {lossData.map((data) => (
                  <RevenueItem data={data} key={data.id} />
                ))}
              </ListView>
            ) : (
              <NoRevenus color="red" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenuePanel;

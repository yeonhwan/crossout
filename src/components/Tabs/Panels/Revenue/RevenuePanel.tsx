// Hooks
import { useState, useEffect } from "react";
import { useWindowWidth } from "@/hooks/useWindowWidth";

// components
import CircleButton from "@/components/Buttons/CircleButton";
import ListView from "@/components/Lists/ListView";
import RevenueItem from "@/components/Lists/Items/RevenueItem";
import NoRevenus from "@/components/Graphic/NoRevenues";

// ICONS
import MoneyAllIcon from "public/icons/money_all.svg";
import MoneyPlusIcon from "public/icons/money_plus.svg";
import MoneyMinusIcon from "public/icons/money_minus.svg";
import AddIcon from "@mui/icons-material/Add";

// type
import { type RevenueClient } from "@/types/client";

// utils
import { currencyFormatter } from "@/utils/currencyFormatter";
import { type GetRevenuesOutput } from "@/utils/api";

type RevenuePanelProps = {
  openCreateRevenue: () => void;
  data: GetRevenuesOutput["data"] | undefined;
  isRevenuesLoading: boolean;
};

const RevenuePanel = ({ openCreateRevenue, data }: RevenuePanelProps) => {
  const [profitData, setProfitData] = useState<RevenueClient[]>([]);
  const [lossData, setLossData] = useState<RevenueClient[]>([]);
  const [total, setTotal] = useState("$0");
  const [viewAll, setViewAll] = useState(true);
  const [viewProfit, setViewProfit] = useState(false);
  const [viewLoss, setViewLoss] = useState(false);
  const isMediaMatches = useWindowWidth(false, 640);

  useEffect(() => {
    if (data) {
      const total = data.reduce((acc, cur) => acc + Number(cur.revenue), 0);
      const profitData = data.filter((data) => Number(data.revenue) >= 0);
      const lossData = data.filter((data) => Number(data.revenue) < 0);
      setProfitData(profitData);
      setLossData(lossData);
      setTotal(currencyFormatter(total));
    } else {
      setProfitData([]);
      setLossData([]);
      setTotal("$0");
    }
  }, [data]);

  return (
    <div className="mt-4 flex h-[95%] w-[90%] flex-col rounded-lg bg-neutral-300/40 px-4 pt-4 backdrop-blur-sm transition-colors dark:bg-neutral-800/60 sm:h-[80%] sm:p-6 lg:w-3/5">
      <div className="flex h-full w-full flex-col justify-around sm:flex-row">
        <div className="relative flex h-20 w-full flex-col-reverse items-center justify-center self-center px-10 sm:h-[65%] sm:w-1/4 sm:min-w-[180px] sm:flex-col sm:justify-between">
          <div className="flex h-max w-max items-center sm:h-[80%] sm:w-36 sm:flex-col">
            <div className="flex h-max w-36 items-center justify-evenly rounded-xl bg-neutral-300/60 py-2 transition-colors dark:bg-neutral-600/40 sm:mt-2 sm:h-[80%] sm:max-h-48 sm:w-full sm:flex-col sm:justify-between">
              <CircleButton
                className={`h-8 w-8 hover:bg-cyan-400 dark:hover:bg-cyan-500 sm:h-10 sm:w-10 ${
                  viewAll
                    ? "pointer-events-none bg-cyan-400 dark:bg-cyan-500"
                    : ""
                }`}
                infoPlace={isMediaMatches ? "left" : "top"}
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
                className={`h-8 w-8 sm:h-10 sm:w-10 ${
                  viewProfit
                    ? "pointer-events-none bg-emerald-400 dark:bg-emerald-500"
                    : ""
                }`}
                infoPlace={isMediaMatches ? "left" : "top"}
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
                className={`h-8 w-8 hover:bg-red-500 sm:h-10 sm:w-10 ${
                  viewLoss
                    ? "pointer-events-none bg-red-500 dark:bg-red-500"
                    : ""
                }`}
                infoPlace={isMediaMatches ? "left" : "top"}
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
              infoPlace={isMediaMatches ? "left" : "top"}
              className="ml-2 flex h-8 w-8 items-center justify-center hover:bg-cyan-400 dark:hover:bg-cyan-500 sm:mt-2 sm:h-10 sm:w-10"
              onClick={openCreateRevenue}
            >
              <AddIcon className="h-6 w-6" />
            </CircleButton>
          </div>
          <div className="mb-2 mt-0 flex flex-col items-center justify-center rounded-md bg-neutral-500/20 px-4 py-1 sm:mt-2">
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
        <div className="flex h-3/4 w-full flex-col items-center justify-around sm:h-full sm:w-3/4">
          <div
            className={`flex w-full overflow-y-scroll rounded-xl bg-emerald-400/50 px-2 py-2 transition-all delay-[100] duration-200 dark:bg-emerald-300/50 ${
              viewProfit
                ? "h-full"
                : viewLoss
                ? "h-0 overflow-hidden opacity-0"
                : "h-[45%]"
            }`}
          >
            {profitData.length ? (
              <ListView className="pt-2 sm:px-6 sm:py-3">
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
            className={`flex w-full overflow-y-scroll rounded-xl bg-red-400/50 px-2 pt-2 transition-all delay-[100] duration-200 dark:bg-red-300/50 ${
              viewLoss
                ? "h-full"
                : viewProfit
                ? "h-0 overflow-hidden opacity-0"
                : "h-[45%]"
            }`}
          >
            {lossData.length ? (
              <ListView className="pt-2 sm:px-6 sm:py-3">
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

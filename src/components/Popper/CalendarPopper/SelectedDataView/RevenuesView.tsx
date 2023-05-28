// types
import { type SelectedDateDateType } from "@/types/client";

// utils
import { currencyFormatter } from "@/utils/currencyFormatter";

// components
import ListView from "@/components/Lists/ListView";
import NoRevenus from "@/components/Graphic/NoRevenues";

type RevenuesViewProps = {
  data: SelectedDateDateType;
};

const RevenuesView = ({ data }: RevenuesViewProps) => {
  const revenues = data.revenues!;
  const total = revenues.reduce((acc, cur) => acc + Number(cur.revenue), 0);
  const profitData = revenues.filter((data) => Number(data.revenue) >= 0);
  const lossData = revenues.filter((data) => Number(data.revenue) < 0);

  return (
    <div className="flex h-full w-full flex-col px-8 py-4">
      <p className="self-center text-lg font-semibold text-white">Revenue</p>
      <p className="self-center text-white">
        total:
        <span
          className={`ml-2 font-semibold ${
            total > 0 ? "text-emerald-400" : "text-red-300"
          }`}
        >
          {currencyFormatter(total)}
        </span>
      </p>
      <div className="flex h-[80%] max-h-[450px] w-full flex-col items-center py-6">
        <ListView className="ml-3 p-4 pb-0">
          {profitData.length ? (
            profitData.map((data) => {
              return (
                <li
                  key={data.id}
                  className="my-1 flex h-max w-[80%] flex-col rounded-md bg-emerald-400 p-1 text-center"
                >
                  <p className="text-sm font-bold text-white">{data.purpose}</p>
                  <p className="text-sm text-white">
                    {currencyFormatter(data.revenue)}
                  </p>
                </li>
              );
            })
          ) : (
            <NoRevenus />
          )}
        </ListView>
        <div className="my-2 h-[1px] w-[80%] border-b-2 border-dotted border-b-neutral-300 " />
        <ListView className="ml-3 p-4 pt-1">
          {lossData.length ? (
            lossData.map((data) => {
              return (
                <li
                  key={data.id}
                  className="my-1 flex h-max w-[80%] flex-col rounded-md bg-red-300 p-1 text-center"
                >
                  <p className="text-sm font-bold text-white">{data.purpose}</p>
                  <p className="text-sm text-white">
                    {currencyFormatter(data.revenue)}
                  </p>
                </li>
              );
            })
          ) : (
            <NoRevenus />
          )}
        </ListView>
      </div>
    </div>
  );
};

export default RevenuesView;

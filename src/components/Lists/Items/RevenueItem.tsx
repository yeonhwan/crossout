// components
import CircleButton from "@/components/Buttons/CircleButton";

// Icons
import ProfitIcon from "public/icons/profit.svg";
import DeficitIcon from "public/icons/deficit.svg";
import TrashIcon from "public/icons/trash.svg";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

type RevenueItemProps = {
  data: {
    purpose: string;
    spentOrEarn: number;
  };
};

const setRevenueDefault = (value: number) => {
  const isSurplus = value >= 0 ? true : false;
  const absValue = Math.abs(value);
  const currencyFormatter = new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    signDisplay: "never",
  });

  return [isSurplus, isSurplus ? "+" : "-", currencyFormatter.format(absValue)];
};

const RevenueItem = ({ data }: RevenueItemProps) => {
  const { purpose, spentOrEarn } = data;
  const [isSurplus, sign, money] = setRevenueDefault(spentOrEarn);

  return (
    <div
      className={`relative m-2 flex h-16 w-full justify-center rounded-lg ${
        isSurplus ? "bg-emerald-600" : "bg-red-400"
      } p-2 drop-shadow-lg`}
    >
      <div
        className={`absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full ${
          isSurplus ? "bg-emerald-400" : "bg-red-300"
        }`}
      >
        {isSurplus ? (
          <ProfitIcon className="h-5 w-5 fill-emerald-800 pb-1" />
        ) : (
          <DeficitIcon className="h-5 w-5 fill-red-800 pt-1" />
        )}
      </div>
      <div className="flex flex-col items-center text-white">
        <p className="font-semibold">For Shopping</p>
        <p className="font-smibold text-sm">
          <span>{sign}</span>
          {money}
        </p>
      </div>
      <div className="absolute right-4 top-4 flex w-[11%] min-w-max items-center justify-between">
        <CircleButton className="flex h-7 w-7 rounded-lg bg-neutral-600/50">
          <ModeEditOutlineIcon className="h-3 w-3" />
        </CircleButton>
        <CircleButton className="flex h-7 w-7 rounded-lg bg-neutral-600/50">
          <TrashIcon className="h-3 w-3" fill="white" />
        </CircleButton>
      </div>
    </div>
  );
};

export default RevenueItem;

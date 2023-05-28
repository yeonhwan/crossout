import NoRevenueIcon from "public/icons/no-revenues.svg";

type NoRevnuesProp = {
  color?: "red" | "green";
};

const NoRevenus = ({ color }: NoRevnuesProp) => {
  if (color === "green") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <NoRevenueIcon className={`h-14 w-14 stroke-emerald-600`} />
        <p className={`text-md font-semibold text-emerald-600`}>No Records</p>
      </div>
    );
  } else if (color === "red") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <NoRevenueIcon className={`h-14 w-14 stroke-red-400`} />
        <p className={`text-md font-semibold text-red-400`}>No Records</p>
      </div>
    );
  } else {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <NoRevenueIcon className={`h-14 w-14 stroke-white`} />
        <p className={`text-md font-semibold text-white`}>No Records</p>
      </div>
    );
  }
};

export default NoRevenus;

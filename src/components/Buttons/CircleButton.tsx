// libs
import Tooltip from "@mui/material/Tooltip";
import { twMerge } from "tailwind-merge";

// Props TYPE
type ButtonProps = {
  children: JSX.Element;
  clickHandler: () => void;
  info?: string;
  className?: string;
};

export default function CircleButton({
  children,
  clickHandler,
  info,
  className,
}: ButtonProps) {
  const defaultClassName =
    "flex h-max w-max items-center justify-center rounded-full border-none p-2 outline-none hover:cursor-pointer hover:bg-emerald-500";

  if (className) {
    className = twMerge(defaultClassName, className);
  }

  if (info) {
    return (
      <Tooltip title={info} arrow placement="top">
        <button
          onClick={clickHandler}
          className={className || defaultClassName}
        >
          {children}
        </button>
      </Tooltip>
    );
  } else {
    return (
      <button onClick={clickHandler} className={className || defaultClassName}>
        {children}
      </button>
    );
  }
}

// libs
import Tooltip from "@mui/material/Tooltip";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children: JSX.Element;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  info?: string;
  className?: string;
  infoPlace?: "top" | "bottom" | "left" | "right";
};

const CircleButton = ({
  children,
  onClick,
  info,
  className,
  infoPlace,
}: ButtonProps) => {
  const defaultClassName =
    "flex h-max w-max dark:bg-neutral-800 dark:hover:bg-emerald-500 items-center fill-white bg-neutral-500 justify-center rounded-full border-none p-2 outline-none hover:cursor-pointer hover:bg-emerald-500";

  if (className) {
    className = twMerge(defaultClassName, className);
  }

  const onClickWrapper = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    } else {
      console.log("clicked");
    }
  };

  if (info) {
    return (
      <Tooltip title={info} arrow placement={infoPlace || "top"}>
        <button
          onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
          }}
          onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
          }}
          onClick={onClickWrapper}
          className={className || defaultClassName}
        >
          {children}
        </button>
      </Tooltip>
    );
  } else {
    return (
      <button
        onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
        }}
        onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
        }}
        onClick={onClickWrapper}
        className={className || defaultClassName}
      >
        {children}
      </button>
    );
  }
};

export default CircleButton;

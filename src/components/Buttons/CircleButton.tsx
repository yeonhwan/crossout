// libs
import Tooltip from "@mui/material/Tooltip";

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
  if (className) {
    className =
      className +
      " " +
      "flex h-max w-max items-center justify-center rounded-full border-none p-2 outline-none hover:cursor-pointer hover:bg-emerald-500";
  }

  if (info) {
    return (
      <Tooltip title={info} arrow placement="top">
        <button onClick={clickHandler} className={className}>
          {children}
        </button>
      </Tooltip>
    );
  } else {
    return (
      <button onClick={clickHandler} className={className}>
        {children}
      </button>
    );
  }
}

import Tooltip from "@mui/material/Tooltip";

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
}: ButtonProps) {
  if (info) {
    return (
      <Tooltip title={info} arrow placement="top">
        <button
          onClick={clickHandler}
          className={
            "flex h-max w-max items-center justify-center rounded-full p-2 outline-none hover:bg-emerald-500"
          }
        >
          {children}
        </button>
      </Tooltip>
    );
  } else {
    return (
      <button
        onClick={clickHandler}
        className="flex h-max w-max items-center justify-center rounded-full p-2 outline-none hover:bg-emerald-500"
      >
        {children}
      </button>
    );
  }
}

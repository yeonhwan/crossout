// libs
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children?: string | JSX.Element;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

const Button = ({ children, onClick, className }: ButtonProps) => {
  const defaultClassName =
    "mx-2 w-max max-h-12 px-2 py-2 shadow-lg hover:cursor-pointer hover:outline-2 hover:outline-emerald-400";

  const onClickWrapper = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    } else {
      console.log("clicked");
    }
  };

  if (className) {
    className = twMerge(defaultClassName, className);
  } else {
    className = defaultClassName;
  }

  return (
    <button onClick={onClickWrapper} className={className}>
      {children}
    </button>
  );
};

export default Button;

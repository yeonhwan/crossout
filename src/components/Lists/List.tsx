// libs
import { twMerge } from "tailwind-merge";

// Props TYPE
type ListProps = {
  children?: JSX.Element;
  className?: string;
};

export default function List({ children, className }: ListProps) {
  const defaultClassName =
    "my-1.5 flex h-max min-h-[3.5rem] w-5/6 items-center rounded-full border-2 border-neutral-400 bg-neutral-600/70 shadow-lg drop-shadow-xl";

  if (className) {
    className = twMerge(defaultClassName, className);
  } else {
    className = defaultClassName;
  }

  return <div className={className}>{children}</div>;
}

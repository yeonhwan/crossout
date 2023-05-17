// libs
import { twMerge } from "tailwind-merge";

// styles
import masking_styles from "@/styles/masking.module.css";

// Props TYPE
type ListViewProps = {
  children?: JSX.Element | JSX.Element[];
  className?: string;
};

export default function ListView({ children, className }: ListViewProps) {
  const defaultClassName = "flex h-max min-h-full w-full flex-col items-center";

  if (className) {
    className = twMerge(defaultClassName, className);
  }

  return (
    <div
      className={`flex h-full w-full justify-center overflow-scroll ${
        masking_styles.masking as string
      }`}
    >
      <div className={className || defaultClassName}>{children}</div>
    </div>
  );
}

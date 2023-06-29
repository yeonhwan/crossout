// libs
import { twMerge } from "tailwind-merge";

// styles
import masking_styles from "@/styles/masking.module.css";

type ListViewProps = {
  children?: JSX.Element | JSX.Element[];
  className?: string;
  viewHeight?: number;
  maskOn?: boolean;
};

const ListView = ({
  children,
  className,
  viewHeight,
  maskOn = true,
}: ListViewProps) => {
  const defaultClassName = "flex h-max min-h-full w-full flex-col items-center";

  if (className) {
    className = twMerge(defaultClassName, className);
  }

  if (viewHeight) {
    const height = `h-[${viewHeight}%]`;

    return (
      <div
        className={`scrollable flex ${height} w-full justify-center overflow-y-auto overflow-x-hidden ${
          maskOn ? (masking_styles.masking as string) : ""
        }`}
      >
        <ul className={className || defaultClassName}>{children}</ul>
      </div>
    );
  } else {
    return (
      <div
        className={`scrollable flex h-full w-full overflow-y-auto overflow-x-hidden ${
          maskOn ? (masking_styles.masking as string) : ""
        }`}
      >
        <ul className={className || defaultClassName}>{children}</ul>
      </div>
    );
  }
};

export default ListView;

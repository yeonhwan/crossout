// libs
import { twMerge } from "tailwind-merge";

// styles
import masking_styles from "@/styles/masking.module.css";

// Props TYPE
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
        className={`flex ${height} w-full justify-center overflow-scroll ${
          maskOn ? (masking_styles.masking as string) : ""
        }`}
      >
        <div className={className || defaultClassName}>{children}</div>
      </div>
    );
  } else {
    return (
      <div
        className={`flex h-full w-full overflow-scroll ${
          maskOn ? (masking_styles.masking as string) : ""
        }`}
      >
        <div className={className || defaultClassName}>{children}</div>
      </div>
    );
  }
};

export default ListView;

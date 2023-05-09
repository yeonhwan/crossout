// styles
import masking_styles from "@/styles/masking.module.css";

// Props TYPE
type ListViewProps = {
  children?: JSX.Element | JSX.Element[];
};

export default function ListView({ children }: ListViewProps) {
  return (
    <div
      className={`mt-4 flex h-[80%] max-h-[450px] w-3/5 justify-center rounded-lg bg-neutral-400/40 py-8 backdrop-blur-sm`}
    >
      <div
        className={`flex h-full w-full justify-center overflow-scroll ${
          masking_styles.masking as string
        }`}
      >
        <div className={`flex h-max min-h-full w-full flex-col items-center`}>
          {children}
        </div>
      </div>
    </div>
  );
}

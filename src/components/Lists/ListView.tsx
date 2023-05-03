import masking_styles from "@/styles/masking.module.css";

type ListViewProps = {
  children?: JSX.Element | JSX.Element[];
};

export default function ListView({ children }: ListViewProps) {
  return (
    <div
      className={`mt-4 flex h-4/5 max-h-96 w-2/3 justify-center rounded-lg bg-neutral-400/40 backdrop-blur-sm`}
    >
      <div
        className={`flex h-full w-full justify-center overflow-scroll py-4 ${
          masking_styles.masking as string
        }`}
      >
        <div className={`flex h-max w-full flex-col items-center`}>
          {children}
        </div>
      </div>
    </div>
  );
}

type SwitchProps = {
  switchState: boolean;
  toggleSwitch: () => void;
  onIcon: JSX.Element;
  offIcon: JSX.Element;
};

export default function Switch({
  switchState,
  toggleSwitch,
  onIcon,
  offIcon,
}: SwitchProps) {
  return (
    <div
      onClick={toggleSwitch}
      className={`flex h-8 w-16 items-center rounded-full border-2 border-neutral-400 ${
        switchState ? "bg-neutral-100" : "bg-neutral-800"
      } px-0.5 transition-all hover:cursor-pointer`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${
          switchState
            ? "translate-x-0 bg-orange-400"
            : "translate-x-8 bg-indigo-600"
        }`}
      >
        {switchState ? onIcon : offIcon}
      </span>
    </div>
  );
}

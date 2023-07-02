// components
import Button from "@/components/Buttons/Button";
// icons
import NoListboardsIcon from "public/icons/no-listboards.svg";

type NoListboardsProps = {
  buttonHandler: () => void;
};

const NoListboards = ({ buttonHandler }: NoListboardsProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <NoListboardsIcon className="ml-4 h-24 w-24 stroke-black dark:stroke-neutral-200 sm:h-32 sm:w-32" />
      <h1 className="mt-2 text-base font-bold text-neutral-800 dark:text-white sm:text-lg">
        Oops, Nothing to show
      </h1>
      <p className="text-xs text-neutral-700 dark:text-neutral-200 sm:text-sm">
        No listboard has been created yet
      </p>
      <Button
        onClick={buttonHandler}
        className="z-40 mt-2 min-w-max bg-cyan-700 text-white outline-none hover:border-none hover:bg-orange-400 hover:outline-0 dark:bg-cyan-500 dark:text-white"
      >
        New Listboard
      </Button>
    </div>
  );
};

export default NoListboards;

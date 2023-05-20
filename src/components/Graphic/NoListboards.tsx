import NoListsIcon from "@/components/Graphic/Icons/NoListsIcon";
import Button from "@/components/Buttons/Button";

type NoListboardsProps = {
  buttonHandler: () => void;
};

const NoListboards = ({ buttonHandler }: NoListboardsProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <NoListsIcon className="ml-4 h-32 w-32" color="rgb(38 38 38)" />
      <h1 className="mt-2 text-lg font-bold text-neutral-800">
        Oops, Nothing to show
      </h1>
      <p className="text-sm text-neutral-700">
        No listboard has been created yet
      </p>
      <Button
        onClick={buttonHandler}
        className="mt-2 bg-cyan-700 outline-none hover:border-none hover:bg-orange-400 hover:outline-0"
      >
        New Listboard
      </Button>
    </div>
  );
};

export default NoListboards;

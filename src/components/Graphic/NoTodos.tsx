import NoDataIcon from "@/components/Graphic/Icons/NoDataIcon";
import Button from "@/components/Buttons/Button";

type NoTodosProps = {
  buttonHandler: () => void;
};

const NoTodos = ({ buttonHandler }: NoTodosProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <NoDataIcon className="h-32 w-32" color="rgb(38 38 38)" />
      <h1 className="mt-2 text-lg font-bold text-neutral-800">
        Oops, Nothing to show
      </h1>
      <p className="text-sm text-neutral-700">No todo has been created yet</p>
      <Button
        onClick={buttonHandler}
        className="mt-2 bg-cyan-700 outline-none hover:border-none hover:bg-orange-400 hover:outline-0"
      >
        New Todo
      </Button>
    </div>
  );
};

export default NoTodos;

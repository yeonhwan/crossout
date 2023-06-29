// components
import Button from "@/components/Buttons/Button";

// icons
import NoTodosIcon from "public/icons/no-todos.svg";

type NoTodosProps = {
  buttonHandler: () => void;
};

const NoTodos = ({ buttonHandler }: NoTodosProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <NoTodosIcon className="h-24 w-24 stroke-black dark:stroke-neutral-200 sm:h-32 sm:w-32" />
      <h1 className="text-md mt-2 font-bold text-neutral-800 dark:text-white sm:text-lg">
        Oops, Nothing to show
      </h1>
      <p className="text-xs text-neutral-700 dark:text-neutral-200 sm:text-sm">
        No todo has been created yet
      </p>
      <Button
        onClick={buttonHandler}
        className="mt-2 bg-cyan-700 text-white outline-none hover:border-none hover:bg-orange-400 hover:outline-0 dark:bg-cyan-500 dark:text-white"
      >
        New Todo
      </Button>
    </div>
  );
};

export default NoTodos;

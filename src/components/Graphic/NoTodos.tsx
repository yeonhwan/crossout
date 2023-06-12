import Button from "@/components/Buttons/Button";
import NoTodosIcon from "public/icons/no-todos.svg";

type NoTodosProps = {
  buttonHandler: () => void;
};

const NoTodos = ({ buttonHandler }: NoTodosProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <NoTodosIcon className="h-32 w-32 stroke-black dark:stroke-neutral-200" />
      <h1 className="mt-2 text-lg font-bold text-neutral-800 dark:text-white">
        Oops, Nothing to show
      </h1>
      <p className="text-sm text-neutral-700 dark:text-neutral-200">
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

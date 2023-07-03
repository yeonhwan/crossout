// components
import ListView from "@/components/Lists/ListView";

// enums
import { UrgencyDisplay } from "@/types/client";

// types
import { type SelectedDateDateType } from "@/types/client";

type TodosViewProps = {
  data: SelectedDateDateType;
};

const TodosView = ({ data }: TodosViewProps) => {
  if (!data.todos) throw new Error("data does not exist");
  const todos = data.todos;

  return (
    <div className="flex h-full w-full flex-col px-8 py-4">
      <p className="self-center text-lg font-semibold text-white">Todos</p>
      <div className="flex h-[90%] w-full sm:h-full">
        <ListView className="py-4">
          {todos.map((data) => {
            return (
              <li
                className={`relative mt-2 flex h-max w-[95%] max-w-[350px] flex-col justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded-lg p-1 text-center dark:text-white ${
                  data.completed
                    ? "bg-neutral-500/50 text-neutral-500 dark:bg-neutral-600/50 dark:text-neutral-700"
                    : "bg-neutral-400/50 dark:bg-neutral-800/50"
                }`}
                key={data.id}
              >
                <div
                  className={`relative flex h-max w-full items-center justify-center self-center ${
                    data.completed
                      ? "after:absolute after:top-1/2 after:h-[2px] after:w-full after:bg-neutral-700/50 after:px-4 after:content-[''] dark:after:bg-neutral-200/80"
                      : ""
                  }`}
                >
                  <span className="mr-1 text-xs">
                    {UrgencyDisplay[data.urgency]}
                  </span>
                  <p>{data.content}</p>
                </div>
                <span className="ml-4 text-xs text-neutral-600 dark:text-neutral-200">
                  {data.listBoard ? data.listBoard.title : ""}
                </span>
              </li>
            );
          })}
        </ListView>
      </div>
    </div>
  );
};

export default TodosView;

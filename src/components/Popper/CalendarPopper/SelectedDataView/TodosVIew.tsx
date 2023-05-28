// components
import ListView from "@/components/Lists/ListView";

// types
import { type SelectedDateDateType } from "@/types/client";

// enums
import { UrgencyDisplay } from "@/types/client";

type TodosViewProps = {
  data: SelectedDateDateType;
};

const TodosView = ({ data }: TodosViewProps) => {
  const todos = data.todos!;

  return (
    <div className="flex h-full w-full flex-col px-8 py-4">
      <p className="self-center text-lg font-semibold text-white">Todos</p>
      <div className="flex h-full w-full">
        <ListView className="py-4">
          {todos.map((data) => {
            return (
              <li
                className={`relative mt-2 flex h-max w-1/2 justify-center rounded-lg p-1 text-center ${
                  data.completed
                    ? "bg-neutral-700/50 text-neutral-500 after:absolute after:left-auto after:top-1/2 after:h-[2px] after:w-[90%] after:bg-neutral-400/50 after:px-4 after:content-['']"
                    : "bg-neutral-400/50"
                }`}
                key={data.id}
              >
                <span className="mr-1">{UrgencyDisplay[data.urgency]}</span>
                {data.content}
              </li>
            );
          })}
        </ListView>
      </div>
    </div>
  );
};

export default TodosView;

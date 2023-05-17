// components
import ListView from "@/components/Lists/ListView";
import TodoItem from "@/components/Lists/Items/TodoItem";
import SortableWrapper from "@/components/Lists/Items/SortableWrapper";
import TodoControllers from "./TodoControllers";

// React
import { useState, useRef } from "react";

// libs
import {
  DndContext,
  type DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// api
import { api } from "@/utils/api";

// stores
import useDateStore from "@/stores/useDateStore";

//types
import { type Todo } from "@prisma/client";

// styles
import loader_styles from "@/styles/loader.module.css";

// props
type TodoPanelProps = {
  enabled: boolean;
};

export type UpdateTodoIndexData = {
  data: { dateRecordId: number; index: number[] };
};

const TodoPanel = ({ enabled }: TodoPanelProps) => {
  const [todosData, setTodosData] = useState<Todo[]>([]);
  const [todoIndexes, setTodoIndexes] = useState<number[]>([]);
  const [sortingTodos, setSortingTodos] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));
  const { year, month, date } = useDateStore((state) => state.dateObj);
  const dateRecordId = useRef<null | number>(null);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (todosData && over) {
      if (active.id !== over.id) {
        setTodosData((items) => {
          const oldIndex = todoIndexes.indexOf(active.id as number);
          const newIndex = todoIndexes.indexOf(over.id as number);

          return arrayMove(items, oldIndex, newIndex);
        });
        setTodoIndexes((items) => {
          const oldIndex = todoIndexes.indexOf(active.id as number);
          const newIndex = todoIndexes.indexOf(over.id as number);

          return arrayMove(items, oldIndex, newIndex);
        });
      } else {
        return;
      }
    }
  }

  // apis
  const { isLoading } = api.todo.getTodos.useQuery(
    { dateObject: { year, month, date } },
    {
      queryKey: ["todo.getTodos", { dateObject: { year, month, date } }],
      onSuccess(res) {
        const { data } = res;
        if (data) {
          const { todos, id } = data;
          setTodosData(todos);
          setTodoIndexes(todos.map((todo) => todo.id));
          if (dateRecordId.current !== id) {
            dateRecordId.current = id;
          }
        } else {
          setTodosData([]);
        }
      },
      enabled,
      keepPreviousData: true,
    }
  );

  const { mutate: updateTodoIndex } = api.todo.updateTodoIndex.useMutation({
    onSuccess: (res) => {
      return;
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const updateTodoIndexApplyHandler = () => {
    if (dateRecordId.current) {
      updateTodoIndex({
        data: { dateRecordId: dateRecordId.current, index: todoIndexes },
      });
    } else {
      throw new Error("Wrong Daterecord ID");
    }
  };

  if (isLoading) {
    return (
      <div className="mt-4 flex h-[80%] max-h-[450px] w-3/5 justify-center rounded-lg bg-neutral-400/40 py-8 backdrop-blur-sm">
        <div className="flex h-full w-full items-center justify-center">
          <span className="flex items-center justify-center">
            <span className={`ml-2 ${loader_styles.loader as string}`} />
          </span>
        </div>
      </div>
    );
  } else {
    if (todosData.length) {
      return (
        <div className="mt-4 flex h-[80%] max-h-[450px] w-3/5 flex-col justify-center rounded-lg bg-neutral-400/40 py-2 backdrop-blur-sm">
          <TodoControllers
            sortingTodos={sortingTodos}
            setSortingTodos={setSortingTodos}
            updateTodoIndex={updateTodoIndexApplyHandler}
          />
          <ListView className="min-h-[90%]">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext
                items={todosData}
                strategy={verticalListSortingStrategy}
              >
                <ul className="flex h-full w-full flex-col items-center justify-center">
                  {todosData.map((data) => (
                    <SortableWrapper
                      key={data.id}
                      id={data.id}
                      active={sortingTodos}
                    >
                      <TodoItem
                        data={data}
                        setSortingTodos={setSortingTodos}
                        sortingTodos={sortingTodos}
                      />
                    </SortableWrapper>
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </ListView>
        </div>
      );
    } else {
      return (
        <div className="mt-4 flex h-[80%] max-h-[450px] w-3/5 justify-center rounded-lg bg-neutral-400/40 py-8 backdrop-blur-sm">
          <p>null</p>
        </div>
      );
    }
  }
};
export default TodoPanel;

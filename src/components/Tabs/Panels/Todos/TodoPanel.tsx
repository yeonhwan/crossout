// components
import ListView from "@/components/Lists/ListView";
import TodoItem from "@/components/Lists/Items/TodoItem";
import SortableWrapper from "@/components/Lists/Items/SortableWrapper";
import TodoControllers from "@/components/Tabs/Panels/Todos/TodoControllers";
import NoTodos from "@/components/Graphic/NoTodos";
import CircleButton from "@/components/Buttons/CircleButton";

// Icons
import LoaderIcon from "public/icons/spinner.svg";
import AddIcon from "@mui/icons-material/Add";

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
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

//types
import { type TodoWithListboardType } from "@/types/client";

// props
type TodoPanelProps = {
  enabled: boolean;
  openCreateTodo: () => void;
};

const TodoPanel = ({ enabled, openCreateTodo }: TodoPanelProps) => {
  const [todosData, setTodosData] = useState<
    TodoWithListboardType[] | undefined
  >();
  const [todoIndexes, setTodoIndexes] = useState<number[]>([]);
  const [sortingTodos, setSortingTodos] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));
  const { year, month, date } = useDateStore((state) => state.dateObj);
  const dateRecordId = useRef<null | number>(null);
  const todosDataSaved = useRef<TodoWithListboardType[]>([]);
  const [isSortProceed, setIsSortProceed] = useState(false);
  const { setSnackbarOpen, setSnackbarData } = useSnackbarStore(
    (state) => state
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (todosData && over) {
      if (active.id !== over.id) {
        setTodosData((items) => {
          if (items) {
            const oldIndex = todoIndexes.indexOf(active.id as number);
            const newIndex = todoIndexes.indexOf(over.id as number);

            return arrayMove(items, oldIndex, newIndex);
          }
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
          todosDataSaved.current = todos;
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
      const { message } = res;
      setSnackbarData({ message, role: SnackbarRole.Success });
      setIsSortProceed(false);
      setSnackbarOpen(true);
      return;
    },
    onError: (err) => {
      const { message } = err;
      setIsSortProceed(false);
      setSnackbarData({ message, role: SnackbarRole.Error });
      setSnackbarOpen(true);
      setTodosData(todosDataSaved.current);
      setIsSortProceed(false);
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
      <div className="mt-4 flex h-[90%] w-[90%] justify-center rounded-lg bg-neutral-300/40 py-8 backdrop-blur-sm dark:bg-neutral-800/60 lg:w-3/5">
        <div className="flex h-full w-full items-center justify-center">
          <LoaderIcon className="h-10 w-10 fill-neutral-700 dark:fill-white" />
        </div>
      </div>
    );
  }

  if (todosData && todosData.length > 0) {
    return (
      <div className="mt-4 flex h-[90%] max-h-[67vh] w-[90%] flex-col rounded-lg bg-neutral-300/40 py-2 backdrop-blur-sm transition-colors dark:bg-neutral-800/60 lg:w-3/5">
        <TodoControllers
          sortingTodos={sortingTodos}
          setSortingTodos={setSortingTodos}
          updateTodoIndex={updateTodoIndexApplyHandler}
          savedTodosData={todosDataSaved}
          setTodosData={setTodosData}
          isSortProceed={isSortProceed}
          setIsSortProceed={setIsSortProceed}
        />
        <ListView viewHeight={80}>
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
                    <TodoItem data={data} sortingTodos={sortingTodos} />
                  </SortableWrapper>
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </ListView>
        {!sortingTodos && (
          <CircleButton
            info="Add Todo"
            onClick={openCreateTodo}
            className="absolute bottom-4 right-2 mr-5 hover:bg-cyan-400 dark:hover:bg-cyan-500"
          >
            <AddIcon className="h-6 w-6" />
          </CircleButton>
        )}
      </div>
    );
  } else if (todosData && !todosData.length) {
    return (
      <div className="mt-4 flex h-[90%] w-[90%] flex-col rounded-lg bg-neutral-300/40 py-2 backdrop-blur-sm transition-colors dark:bg-neutral-800/60 lg:w-3/5">
        <NoTodos buttonHandler={openCreateTodo} />
      </div>
    );
  } else {
    return (
      <div className="mt-4 flex h-[90%] w-[90%] flex-col rounded-lg bg-neutral-300/40 py-2 backdrop-blur-sm transition-colors dark:bg-neutral-800/60 lg:w-3/5">
        <div className="flex h-full w-full items-center justify-center">
          <LoaderIcon className="h-10 w-10 fill-neutral-700 dark:fill-white" />
        </div>
      </div>
    );
  }
};
export default TodoPanel;

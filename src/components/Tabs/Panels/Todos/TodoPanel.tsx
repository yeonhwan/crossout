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
import { useState, useRef, useEffect } from "react";

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

import { useAnimate, stagger } from "framer-motion";

// api
import { api } from "@/utils/api";

// stores
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";
import useDateStore from "@/stores/useDateStore";

//types
import { type TodoWithListboardType } from "@/types/client";
import { type GetTodoOutput } from "@/utils/api";

// props
type TodoPanelProps = {
  openCreateTodo: () => void;
  data: GetTodoOutput["data"] | undefined;
  isTodoLoading: boolean;
};

export type SortingOption = "default" | "completed" | "urgency" | "recent";

const TodoPanel = ({ openCreateTodo, data, isTodoLoading }: TodoPanelProps) => {
  const [todosData, setTodosData] = useState<
    TodoWithListboardType[] | undefined
  >(undefined);
  const [todoIndexes, setTodoIndexes] = useState<number[]>([]);
  const [reorderingTodos, setReorderingTodos] = useState(false);
  const [isReorderProceed, setIsReorderProceed] = useState(false);
  const [sortingOption, setSortingOption] = useState<SortingOption>("default");
  const sensors = useSensors(useSensor(PointerSensor));
  const [scope, animate] = useAnimate();
  const { setSnackbarOpen, setSnackbarData } = useSnackbarStore(
    (state) => state
  );
  const { year, month, date } = useDateStore((state) => state.dateObj);
  const dateRecordId = useRef<null | number>(null);
  const prevTodosData = useRef<TodoWithListboardType[]>();
  const prevTodoIndexes = useRef<number[]>([]);
  const prevDateString = useRef<string>();
  const utils = api.useContext();

  const sortTodosData = (
    todos: TodoWithListboardType[],
    mode: SortingOption
  ) => {
    switch (mode) {
      case "default":
        setTodosData(todos);
        return;
      case "completed":
        const completedTodos: TodoWithListboardType[] = [];
        const uncompletedTodos: TodoWithListboardType[] = [];
        todos.forEach((todo) => {
          if (todo.completed) {
            completedTodos.push(todo);
          } else {
            uncompletedTodos.push(todo);
          }
        });
        setTodosData([...completedTodos, ...uncompletedTodos]);
        return;
      case "recent":
        const sortedTodos = [...todos];
        sortedTodos.sort((cur, next) => {
          const curDate = new Date(cur.createdAt);
          const nextDate = new Date(next.createdAt);
          return nextDate.getTime() - curDate.getTime();
        });
        setTodosData(sortedTodos);
        return;
      case "urgency":
        const urgentTodos: TodoWithListboardType[] = [];
        const importantTodos: TodoWithListboardType[] = [];
        const trivialTodos: TodoWithListboardType[] = [];
        todos.forEach((todo) => {
          if (todo.urgency === "urgent") {
            urgentTodos.push(todo);
          } else if (todo.urgency === "important") {
            importantTodos.push(todo);
          } else {
            trivialTodos.push(todo);
          }
        });
        setTodosData([...urgentTodos, ...importantTodos, ...trivialTodos]);
        return;

      default:
        throw new Error("Wrong Parameter");
    }
  };

  useEffect(() => {
    const storedSortOption = sessionStorage.getItem("sort");
    console.log(storedSortOption);
    if (
      storedSortOption &&
      (storedSortOption === "default" ||
        storedSortOption === "completed" ||
        storedSortOption === "recent" ||
        storedSortOption === "urgency")
    ) {
      setSortingOption(storedSortOption);
    }
  }, []);

  useEffect(() => {
    if (!data) {
      setTodosData(undefined);
      setTodoIndexes([]);
      return;
    }
    sortTodosData(data.todos, sortingOption);
    setTodoIndexes(data.todoIndex as number[]);
    prevTodosData.current = data.todos;
    dateRecordId.current = data.id;
    prevTodoIndexes.current = data.todoIndex as number[];
  }, [data, sortingOption]);

  useEffect(() => {
    const dateString = String(year + month + date);
    if (
      todosData &&
      todosData.length &&
      dateString !== prevDateString.current
    ) {
      animate(
        "li",
        { y: [10, 0], opacity: [0, 1] },
        {
          duration: 0.2,
          ease: "linear",
          delay: stagger(0.1, { startDelay: 0.1 }),
        }
      )
        .then(() => {
          return;
        })
        .catch(() => {
          return;
        });
    }
    if (todosData && dateString !== prevDateString.current) {
      prevDateString.current = dateString;
    }
  }, [todosData]);

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

  const { mutate: updateTodoIndex } = api.todo.updateTodoIndex.useMutation({
    onSuccess: async () => {
      await utils.todo.getTodos.invalidate();
      setSnackbarData({
        message: "Updated todo indexes",
        role: SnackbarRole.Success,
      });
      setIsReorderProceed(false);
      setSnackbarOpen(true);
      return;
    },
    onError: () => {
      setIsReorderProceed(false);
      setSnackbarData({
        message: "Updated failed. Please try again or report the issue.",
        role: SnackbarRole.Error,
      });
      setSnackbarOpen(true);
      setTodosData(prevTodosData.current);
      setIsReorderProceed(false);
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

  if (isTodoLoading || !data) {
    return (
      <div className="mt-4 flex h-[95%] max-h-[72vh] w-[90%] flex-col rounded-lg bg-neutral-300/40 py-2 backdrop-blur-sm transition-colors dark:bg-neutral-800/60 sm:h-[80%] lg:w-3/5">
        <div className="flex h-full w-full items-center justify-center">
          <LoaderIcon className="h-10 w-10 fill-neutral-700 dark:fill-white" />
        </div>
      </div>
    );
  }

  if (todosData && todosData.length > 0) {
    return (
      <div className="mt-4 flex h-[95%] max-h-[72vh] w-[90%] flex-col rounded-lg bg-neutral-300/40 py-2 backdrop-blur-sm transition-colors dark:bg-neutral-800/60 sm:h-[80%] lg:w-3/5">
        <TodoControllers
          reorderingTodos={reorderingTodos}
          setReorderingTodos={setReorderingTodos}
          updateTodoIndex={updateTodoIndexApplyHandler}
          prevTodosData={prevTodosData}
          prevTodoIndexes={prevTodoIndexes}
          setTodosData={setTodosData}
          isReorderProceed={isReorderProceed}
          setIsReorderProceed={setIsReorderProceed}
          setTodoIndexes={setTodoIndexes}
          sortingOption={sortingOption}
          setSortingOption={setSortingOption}
        />
        <ListView viewHeight={80}>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext
              items={todosData}
              strategy={verticalListSortingStrategy}
            >
              <ul
                ref={scope}
                className="flex h-full w-full flex-col items-center justify-center"
              >
                {todosData.map((data) => (
                  <SortableWrapper
                    key={data.id}
                    id={data.id}
                    active={reorderingTodos}
                  >
                    <TodoItem data={data} sortingTodos={reorderingTodos} />
                  </SortableWrapper>
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </ListView>
        {!reorderingTodos && (
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
      <div className="mt-4 flex h-[95%] max-h-[72vh] w-[90%] flex-col rounded-lg bg-neutral-300/40 py-2 backdrop-blur-sm transition-colors dark:bg-neutral-800/60 sm:h-[80%] lg:w-3/5">
        <NoTodos buttonHandler={openCreateTodo} />
      </div>
    );
  } else {
    return (
      <div className="mt-4 flex h-[95%] max-h-[72vh] w-[90%] flex-col rounded-lg bg-neutral-300/40 py-2 backdrop-blur-sm transition-colors dark:bg-neutral-800/60 sm:h-[80%] lg:w-3/5">
        <div className="flex h-full w-full items-center justify-center">
          <LoaderIcon className="h-10 w-10 fill-neutral-700 dark:fill-white" />
        </div>
      </div>
    );
  }
};
export default TodoPanel;

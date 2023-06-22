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

const TodoPanel = ({ openCreateTodo, data, isTodoLoading }: TodoPanelProps) => {
  const [todosData, setTodosData] = useState<
    TodoWithListboardType[] | undefined
  >(undefined);
  const [todoIndexes, setTodoIndexes] = useState<number[]>([]);
  const [sortingTodos, setSortingTodos] = useState(false);
  const [isSortProceed, setIsSortProceed] = useState(false);
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

  useEffect(() => {
    setTodosData(data ? data.todos : undefined);
    setTodoIndexes(data ? (data.todoIndex as number[]) : []);
    prevTodosData.current = data ? data.todos : undefined;
    dateRecordId.current = data ? data.id : null;
    prevTodoIndexes.current = data ? (data.todoIndex as number[]) : [];
  }, [data]);

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
  }, [todosData]);

  useEffect(() => {
    const dateString = String(year + month + date);
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
    onSuccess: () => {
      setSnackbarData({
        message: "Updated todo indexes",
        role: SnackbarRole.Success,
      });
      setIsSortProceed(false);
      setSnackbarOpen(true);
      return;
    },
    onError: () => {
      setIsSortProceed(false);
      setSnackbarData({
        message: "Updated failed. Please try again or report the issue.",
        role: SnackbarRole.Error,
      });
      setSnackbarOpen(true);
      setTodosData(prevTodosData.current);
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
          sortingTodos={sortingTodos}
          setSortingTodos={setSortingTodos}
          updateTodoIndex={updateTodoIndexApplyHandler}
          prevTodosData={prevTodosData}
          prevTodoIndexes={prevTodoIndexes}
          setTodosData={setTodosData}
          isSortProceed={isSortProceed}
          setIsSortProceed={setIsSortProceed}
          setTodoIndexes={setTodoIndexes}
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

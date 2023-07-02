// components
import CircleButton from "@/components/Buttons/CircleButton";
import ListboardSelect from "@/components/Select/ListboardSelect";
import Select from "@/components/Select/Select";

// hooks
import { useState, useRef } from "react";

// libs
import ClickAwayListener from "@mui/base/ClickAwayListener";

// api
import { api } from "@/utils/api";

// stores
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

// icons
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import TrashIcon from "public/icons/trash.svg";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import LoaderIcon from "public/icons/spinner.svg";

// types
import type { Todo, ListBoard } from "@prisma/client";
import { UrgencyDisplay, UrgencyInput } from "@/types/client";

type TodoItemProps = {
  data: Todo & {
    listBoard: ListBoard | null;
  };
  id?: number;
  sortingTodos?: boolean;
  listboards?: ListBoard[];
};

const TodoItem = ({ data, sortingTodos, listboards }: TodoItemProps) => {
  const { urgency, content, listBoard, id, completed, dateRecordId } = data;

  const listboardTitle = listBoard?.title;
  const listboardId = listBoard?.id;
  const [isUpdating, setIsUpdating] = useState(false);
  const [todoInput, setTodoInput] = useState(content);
  const [urgencyInput, setUrgencyInput] = useState(urgency);
  const [listboardInput, setListboardInput] = useState<number | undefined>(
    listboardId
  );
  const [isProceed, setIsProceed] = useState(false);
  const { setSnackbarOpen, setSnackbarData, setSnackbarLoadingState } =
    useSnackbarStore((state) => state);
  const utils = api.useContext();
  const currentTodo = {
    id: data.id,
    content: data.content,
    urgency: data.urgency,
    listBoardId: data.listBoardId ? data.listBoardId : undefined,
    deadline: undefined,
  };
  const previousData = useRef(currentTodo);

  // abort update todo api call
  const { mutate: abortUpdateTodo } = api.todo.updateTodo.useMutation({
    onSuccess: async (res) => {
      const { todo } = res.data;
      await utils.todo.getTodos.invalidate();
      setSnackbarLoadingState(false);
      setSnackbarOpen(true);
      const currentTodo = {
        id: todo.id,
        content: todo.content,
        urgency: todo.urgency,
        listBoardId: todo.listBoardId ? todo.listBoardId : undefined,
        deadline: undefined,
      };
      previousData.current = currentTodo;
      setSnackbarData({
        message: "Canceld update todo",
        role: SnackbarRole.Success,
      });
    },
    onError: () => {
      setSnackbarLoadingState(false);
      setSnackbarOpen(true);
      setSnackbarData({
        message: "Request failed. Please try again or report the issue.",
        role: SnackbarRole.Error,
      });
    },
  });

  // update todo api call
  const { mutate: updateTodo } = api.todo.updateTodo.useMutation({
    onSuccess: async (res) => {
      const { content, todo } = res.data;
      await utils.todo.getTodos.invalidate();
      await utils.listboards.getListboards.invalidate();
      setSnackbarLoadingState(false);
      setIsUpdating(false);
      setIsProceed(false);
      setSnackbarOpen(true);
      setSnackbarData({
        message: "Updated Todo",
        content,
        role: SnackbarRole.Success,
        handler: (data) => {
          setSnackbarLoadingState(true);
          abortUpdateTodo(
            data as {
              data: {
                id: number;
                content?: string;
                urgency?: "urgent" | "important" | "trivial";
                listboardId?: number;
              };
            }
          );
        },
        previousData: { data: previousData.current },
      });
      const currentTodo = {
        id: todo.id,
        content: todo.content,
        urgency: todo.urgency,
        listBoardId: todo.listBoardId ? todo.listBoardId : undefined,
        deadline: undefined,
      };
      previousData.current = currentTodo;
    },
    onError: (err) => {
      const { message } = err;
      setSnackbarOpen(true);
      setSnackbarData({ message, role: SnackbarRole.Error });
    },
  });

  // delete todo api call
  const { mutate: deleteTodo } = api.todo.deleteTodo.useMutation({
    onSuccess: async (res) => {
      const { content } = res.data;
      await utils.todo.getTodos.invalidate();
      await utils.listboards.getListboards.invalidate();
      setIsUpdating(false);
      setSnackbarOpen(true);
      setSnackbarData({
        message: "Deleted Todo",
        content,
        role: SnackbarRole.Success,
      });
    },
    onError: (err) => {
      const { message } = err;
      setIsProceed(false);
      setSnackbarOpen(true);
      setSnackbarData({ message, role: SnackbarRole.Error });
    },
  });

  // complete todo api call
  const { mutate: completeTodo } = api.todo.completeTodo.useMutation({
    onSuccess: async (res) => {
      const { message, content } = res.data;
      await utils.todo.getTodos.invalidate();
      await utils.listboards.getListboards.invalidate();
      setIsProceed(false);
      setSnackbarOpen(true);
      setSnackbarData({ message, content, role: SnackbarRole.Info });
    },
    onError: (err) => {
      const { message } = err;
      setIsProceed(false);
      setSnackbarOpen(true);
      setSnackbarData({ message, role: SnackbarRole.Error });
    },
  });

  // handlers
  const cancelUpdateTodo = () => {
    setTodoInput(content);
    setUrgencyInput(urgency);
    setIsUpdating(false);
  };

  const applyUpdateButtonHandler = () => {
    setIsProceed(true);
    const data = {
      id,
      content:
        previousData.current.content !== todoInput ? todoInput : undefined,
      urgency:
        previousData.current.urgency !== urgencyInput
          ? urgencyInput
          : undefined,
      listBoardId:
        previousData.current.listBoardId !== listboardInput
          ? listboardInput
          : undefined,
      deadline: undefined,
    };
    updateTodo({ data });
  };

  const completeTodoHandler = () => {
    if (data.completed) {
      completeTodo({ data: { id, completed: false } });
      setIsProceed(true);
    } else {
      completeTodo({ data: { id, completed: true } });
      setIsProceed(true);
    }
  };

  // Item Buttons Render
  const ButtonRender = () => {
    if (sortingTodos) return null;

    if (data.completed) {
      return (
        <CircleButton
          info="delete"
          className={`h-5 w-5 rounded-md p-0 hover:bg-red-400 dark:hover:bg-red-400 sm:h-6 sm:w-6 ${
            isProceed ? "pointer-events-none" : ""
          }`}
          onClick={(e) => {
            e?.stopPropagation();
            if (window.confirm("Are you sure want to delete Todo")) {
              setIsProceed(true);
              deleteTodo({ data: { id, dateRecordId } });
            }
          }}
        >
          <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" fill="white" />
        </CircleButton>
      );
    }

    if (isUpdating) {
      return (
        <>
          <CircleButton
            info="apply"
            className={`mr-2 h-5 w-5 rounded-md bg-emerald-300 p-0 transition-none hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-500 sm:h-6 sm:w-6 ${
              todoInput.length <= 0 || todoInput.length > 45
                ? "pointer-events-none bg-neutral-400 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-800"
                : ""
            }`}
            onClick={applyUpdateButtonHandler}
          >
            <CheckIcon
              className={`h-3 w-3 transition-none sm:h-4 sm:w-4 ${
                todoInput.length <= 0 || todoInput.length > 45
                  ? "fill-neutral-400"
                  : ""
              }`}
            />
          </CircleButton>
          <CircleButton
            info="cancel"
            className="h-5 w-5 rounded-md bg-red-300 p-0 hover:bg-red-400 dark:bg-red-400 dark:hover:bg-red-500 sm:h-6 sm:w-6"
            onClick={cancelUpdateTodo}
          >
            <BlockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
          </CircleButton>
        </>
      );
    }

    return (
      <>
        <CircleButton
          info="edit"
          className={`mr-1 h-5 w-5 rounded-md bg-orange-300 p-0 hover:bg-orange-400 dark:bg-orange-400 dark:hover:bg-orange-500 sm:h-6 sm:w-6 ${
            isProceed ? "pointer-events-none" : ""
          }`}
          onClick={(e) => {
            e?.stopPropagation();
            setIsUpdating(true);
          }}
        >
          <ModeEditOutlineIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        </CircleButton>
        <CircleButton
          info="delete"
          className={`h-5 w-5 rounded-md bg-red-300 p-0 hover:bg-red-400 dark:bg-red-400 dark:hover:bg-red-500 sm:h-6 sm:w-6 ${
            isProceed
              ? "pointer-events-none bg-neutral-400 dark:bg-neutral-500"
              : ""
          }`}
          onClick={(e) => {
            e?.stopPropagation();
            if (window.confirm("Are you sure want to delete Todo")) {
              setIsProceed(true);
              deleteTodo({ data: { id, dateRecordId } });
            }
          }}
        >
          <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" fill="white" />
        </CircleButton>
      </>
    );
  };

  // Item Contents Render
  const contentRender = () => {
    // not Updating state
    if (!isUpdating) {
      return (
        <div
          onClick={completeTodoHandler}
          className={`flex h-full w-full items-center justify-between rounded-lg px-4 py-2 text-white hover:cursor-pointer sm:px-10 sm:py-4`}
        >
          <div className="flex items-center">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full sm:h-6 sm:w-6 ${
                completed
                  ? "bg-neutral-200 dark:bg-neutral-700"
                  : "bg-neutral-100 dark:bg-neutral-500"
              }`}
            >
              <p className="text-[10px] sm:text-xs">
                {UrgencyDisplay[urgency]}
              </p>
            </div>
            <div className="ml-2 flex h-6 w-6 items-center justify-center">
              {isProceed && (
                <LoaderIcon className="h-6 w-6 fill-neutral-700 dark:fill-neutral-200" />
              )}
            </div>
          </div>
          <div className="flex w-7/12 flex-col items-center justify-center">
            <p
              className={`relative w-max max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[10px] text-neutral-800 after:absolute after:left-0 after:top-1/2 after:h-[2px] after:w-0 after:bg-neutral-500 after:transition-all after:duration-200 after:ease-in-out after:content-[''] dark:text-neutral-200 dark:after:bg-neutral-600 mobile:text-xs sm:text-base ${
                completed ? "after:w-full" : ""
              }`}
            >
              {content}
            </p>
            {listBoard && (
              <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[9px] font-light text-neutral-800 dark:text-neutral-400 sm:text-sm">
                {listboardTitle}
              </p>
            )}
          </div>
          <div
            className={`flex w-14 ${
              data.completed ? "justify-center" : "justify-evenly"
            }`}
          >
            {ButtonRender()}
          </div>
        </div>
      );
    }
    // Updating state
    else {
      return (
        <ClickAwayListener onClickAway={cancelUpdateTodo}>
          <div className="flex w-full items-center justify-between rounded-xl bg-transparent px-2 py-4 text-white sm:px-10">
            <div className="flex w-full flex-col items-center sm:flex-row">
              <Select
                className="relative mb-1 flex h-6 w-[100px] items-center justify-center rounded-md bg-neutral-600/20 fill-neutral-600/70 pr-2 text-xs focus-within:fill-teal-400 focus-within:ring-2 focus-within:ring-teal-300 hover:cursor-pointer dark:bg-neutral-400/40"
                value={urgencyInput}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setUrgencyInput(e.currentTarget.value as UrgencyInput);
                }}
              >
                <>
                  <option color="black" value={UrgencyInput.trivial}>
                    🌱trivial
                  </option>
                  <option color="black" value={UrgencyInput.important}>
                    ⚡️important
                  </option>
                  <option color="black" value={UrgencyInput.urgent}>
                    🔥urgent
                  </option>
                </>
              </Select>
              <div className="mx-auto flex h-max w-8/12 flex-col items-center justify-center">
                <div className="flex w-full flex-col items-center justify-center">
                  <input
                    className="w-full border-0 bg-neutral-600/20 px-1 py-1 text-center text-xs outline-0 ring-transparent focus-visible:ring-2 focus-visible:ring-teal-300 dark:bg-neutral-400/40 sm:w-8/12 sm:align-middle sm:text-sm"
                    value={todoInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setTodoInput(e.currentTarget.value);
                    }}
                    autoFocus
                  />
                  <span
                    className={`my-1 w-full text-center text-[8px] sm:my-1 sm:w-7/12 ${
                      todoInput.length > 45 || todoInput.length <= 0
                        ? "text-red-400"
                        : ""
                    }`}
                  >{`${todoInput.length} / 45`}</span>
                </div>
                <ListboardSelect
                  className="relative flex h-6 w-full items-center justify-center rounded-md bg-neutral-600/20 fill-neutral-600/70 pr-2 text-xs focus-within:fill-teal-400 focus-within:ring-2 focus-within:ring-teal-300 hover:cursor-pointer dark:bg-neutral-400/40 sm:w-8/12"
                  input={listboardInput}
                  onChange={setListboardInput}
                  data={listboards ? listboards : undefined}
                />
              </div>
            </div>
            <div className="mr-2 flex w-14 justify-between sm:mr-0">
              {isProceed ? (
                <div className="flex h-full w-full items-center justify-center">
                  <LoaderIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              ) : (
                ButtonRender()
              )}
            </div>
          </div>
        </ClickAwayListener>
      );
    }
  };

  return (
    <li
      className={`my-1.5 flex w-[90%] items-center rounded-lg border-0 shadow-lg ring-2 drop-shadow-xl transition-all duration-200 sm:my-2.5 sm:w-5/6 ${
        isUpdating
          ? "h-28 bg-teal-500 ring-teal-300 dark:bg-teal-700"
          : completed
          ? "h-14 bg-neutral-300 ring-neutral-500 hover:ring-teal-600 dark:bg-neutral-600 dark:ring-neutral-300 dark:hover:ring-teal-500 sm:h-20"
          : "h-14 bg-neutral-200 ring-neutral-500 hover:ring-teal-600 dark:bg-neutral-700 dark:ring-neutral-300 dark:hover:ring-teal-500 sm:h-20"
      }`}
    >
      {contentRender()}
    </li>
  );
};

export default TodoItem;

// components
import CircleButton from "@/components/Buttons/CircleButton";

// ICONS
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";

// Types
import { type Todo } from "@prisma/client";

// libs
import dayjs from "dayjs";
import ClickAwayListener from "@mui/base/ClickAwayListener";

// api
import { api } from "@/utils/api";

// React
import React, { useState, useRef } from "react";

// styles
import loader_styles from "@/styles/loader.module.css";

// types
type TodoItemProps = {
  data: Todo;
};

// stores
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

type UpdateTodoData = {
  id: number;
  content?: string | undefined;
  urgency?: typeof Urgency | undefined;
  listboardId?: number | undefined;
  deadline?: Date | undefined;
  completed?: boolean | undefined;
};

enum Urgency {
  urgent = "🔥",
  important = "⚡️",
  trivial = "🌱",
}

// Urgency Enum
enum UrgencyInput {
  urgent = "urgent",
  important = "important",
  trivial = "trivial",
}

type SnackbarHandlerType = (data: object) => void;

const TodoItem = ({ data }: TodoItemProps) => {
  const { urgency, content, deadline, userId, id, completed } = data;
  const deadlineString = deadline ? dayjs(deadline).format("YYYY-M-D") : null;
  const [isUpdating, setIsUpdating] = useState(false);
  const [todoInput, setTodoInput] = useState(content);
  const [urgencyInput, setUrgencyInput] = useState(urgency);
  const [isProceed, setIsProceed] = useState(false);
  const { setSnackbarOpen, setSnackbarData } = useSnackbarStore(
    (state) => state
  );
  const utils = api.useContext();
  const currentData = useRef(data);

  // apis

  const { mutate: abortUpdateTodo } = api.todo.updateTodo.useMutation({
    onSuccess: async (res) => {
      const { message, content, todo } = res.data;
      await utils.todo.getTodos.invalidate();
      setIsUpdating(false);
      setIsProceed(false);
      setSnackbarOpen(true);
      currentData.current = todo;
      setSnackbarData({ message, content, role: SnackbarRole.Success });
    },
    onError: (err) => {
      const { message } = err;
      setSnackbarOpen(true);
      setSnackbarData({ message, role: SnackbarRole.Error });
    },
  });

  const { mutate: updateTodo } = api.todo.updateTodo.useMutation({
    onSuccess: async (res) => {
      const { message, content, todo } = res.data;
      await utils.todo.getTodos.invalidate();
      setIsUpdating(false);
      setIsProceed(false);
      setSnackbarOpen(true);
      currentData.current = todo;
      setSnackbarData({
        message,
        content,
        role: SnackbarRole.Success,
        handler: abortUpdateTodo as SnackbarHandlerType,
        previousData: { data: currentData.current },
      });
    },
    onError: (err) => {
      const { message } = err;
      setSnackbarOpen(true);
      setSnackbarData({ message, role: SnackbarRole.Error });
    },
  });

  const { mutate: deleteTodo } = api.todo.deleteTodo.useMutation({
    onSuccess: async (res) => {
      const { message, content } = res.data;
      await utils.todo.getTodos.invalidate();
      setIsUpdating(false);
      setSnackbarOpen(true);
      setSnackbarData({ message, content, role: SnackbarRole.Success });
    },
    onError: (err) => {
      const { message } = err;
      setIsProceed(false);
      setSnackbarOpen(true);
      setSnackbarData({ message, role: SnackbarRole.Error });
    },
  });

  const { mutate: completeTodo } = api.todo.completeTodo.useMutation({
    onSuccess: async (res) => {
      const { message, content } = res.data;
      await utils.todo.getTodos.invalidate();
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

  const applyUpdateClickHandler = () => {
    setIsProceed(true);
    const data = {
      id,
      content:
        currentData.current.content !== todoInput ? todoInput : undefined,
      urgency:
        currentData.current.urgency !== urgencyInput ? urgencyInput : undefined,
      listboardId: undefined,
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

  if (!isUpdating) {
    return (
      <div
        onClick={completeTodoHandler}
        className={`flex w-full items-center justify-between rounded-full ${
          completed ? "bg-neutral-500" : "bg-neutral-700"
        } px-10 py-4 text-white hover:cursor-pointer`}
      >
        <div className="flex">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-300">
            <p>{Urgency[urgency]}</p>
          </div>
          <div className="ml-2 flex h-6 w-6 items-center justify-center">
            {isProceed && (
              <span className={`${loader_styles.loader as string}`} />
            )}
          </div>
        </div>
        {deadlineString && <p>{deadlineString}</p>}
        <div className="flex w-8/12 justify-center">
          <p
            className={`relative text-center after:absolute after:left-0 after:top-1/2 after:h-[2px] after:w-0 after:bg-neutral-600 after:transition-all after:duration-200 after:ease-in-out after:content-[''] ${
              completed ? "after:w-full" : ""
            }`}
          >
            {content}
          </p>
        </div>
        <div
          className={`flex w-1/12 ${
            data.completed ? "justify-center" : "justify-between"
          }`}
        >
          {!data.completed ? (
            <CircleButton
              info="edit"
              className={`h-6 w-6 p-0 ${
                isProceed ? "pointer-events-none" : ""
              }`}
              clickHandler={(e) => {
                e?.stopPropagation();
                setIsUpdating(true);
              }}
            >
              <EditIcon className="h-4 w-4" />
            </CircleButton>
          ) : null}
          <CircleButton
            info="delete"
            className={`h-6 w-6 p-0 ${isProceed ? "pointer-events-none" : ""}`}
            clickHandler={(e) => {
              e?.stopPropagation();
              if (window.confirm("Are you sure want to delete Todo")) {
                setIsProceed(true);
                deleteTodo({ data: { id } });
              }
            }}
          >
            <DeleteIcon className="h-4 w-4" />
          </CircleButton>
        </div>
      </div>
    );
  } else {
    return (
      <ClickAwayListener onClickAway={cancelUpdateTodo}>
        <div className="flex w-full items-center justify-between rounded-full bg-cyan-800 px-10 py-4 text-white">
          <div className="flex w-max">
            <select
              className="hover:cur rounded-xl bg-neutral-400/40 px-2 outline-none hover:cursor-pointer"
              value={urgencyInput}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setUrgencyInput(e.currentTarget.value as UrgencyInput);
              }}
            >
              <option value={UrgencyInput.trivial}>🌱trivial</option>
              <option value={UrgencyInput.important}>⚡️important</option>
              <option value={UrgencyInput.urgent}>🔥urgent</option>
            </select>
            {deadlineString && <p>{deadlineString}</p>}
          </div>
          <input
            className="w-8/12 bg-neutral-400/40 py-1 text-center align-middle outline-none"
            value={todoInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTodoInput(e.currentTarget.value);
            }}
          />
          <div className="flex w-1/12 justify-between">
            {isProceed ? (
              <div className="h-full w-full">
                <span className="flex h-full w-full items-center justify-center">
                  <span className={`${loader_styles.loader as string}`} />
                </span>
              </div>
            ) : (
              <>
                <CircleButton
                  info="apply"
                  className="h-6 w-6 p-0"
                  clickHandler={applyUpdateClickHandler}
                >
                  <CheckIcon className="h-4 w-4" />
                </CircleButton>
                <CircleButton
                  info="cancel"
                  className="h-6 w-6 p-0"
                  clickHandler={cancelUpdateTodo}
                >
                  <BlockIcon className="h-4 w-4" />
                </CircleButton>
              </>
            )}
          </div>
        </div>
      </ClickAwayListener>
    );
  }
};

export default TodoItem;

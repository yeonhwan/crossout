// Next
import Image from "next/image";

// types
import { type ListboardItemType } from "@/types/client";

// React, hooks
import React, { useState } from "react";

// ICONS
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import TrashIcon from "public/icons/trash.svg";
import LoaderIcon from "public/icons/spinner.svg";

//components
import Button from "@/components/Buttons/Button";
import TodoItem from "@/components/Lists/Items/TodoItem";
import ListView from "@/components/Lists/ListView";
import CircleButton from "@/components/Buttons/CircleButton";
import NoItems from "@/components/Graphic/NoItems";

// libs
import ClickAwayListener from "@mui/base/ClickAwayListener";

// store
import useSnackbarStore from "@/stores/useSnackbarStore";
import { SnackbarRole } from "@/stores/useSnackbarStore";

// api
import { api } from "@/utils/api";

type ListboardPopperProps = {
  isOpen: boolean;
  onTransitionEnd: () => void;
  popperClose: () => void;
  data: ListboardItemType | null;
};

const ListboardPopper = ({
  isOpen,
  onTransitionEnd,
  popperClose,
  data,
}: ListboardPopperProps) => {
  const { todos, title, id, description } = data!;
  const [isUpdate, setIsUpdate] = useState(false);
  const [boardTitleInput, setBoardTitleInput] = useState(title);
  const [boardDescriptionInput, setBoardDescriptionInput] = useState(
    description ? description : undefined
  );
  const [isProceed, setIsProceed] = useState(false);
  const utils = api.useContext();
  const { setSnackbarOpen, setSnackbarData } = useSnackbarStore(
    (state) => state
  );

  const { mutate: updateListboard } =
    api.listboards.updateListboard.useMutation({
      onSuccess: async (res) => {
        const { message, content } = res;
        setIsProceed(false);
        setIsUpdate(false);
        await utils.listboards.getListboards.invalidate();
        setSnackbarData({
          message,
          content,
          role: SnackbarRole.Success,
        });
        setSnackbarOpen(true);
      },
      onError: (err) => {
        const { message } = err;
        setIsProceed(false);
        setIsUpdate(false);
        setSnackbarData({
          message,
          role: SnackbarRole.Error,
        });
        setSnackbarOpen(true);
      },
    });

  const { mutate: deleteListboard } =
    api.listboards.deleteListboard.useMutation({
      onSuccess: async (res) => {
        const { message, content } = res;
        await utils.listboards.getListboards.invalidate();
        setSnackbarData({
          message,
          content,
          role: SnackbarRole.Success,
        });
        setSnackbarOpen(true);
        popperClose();
      },
      onError: (err) => {
        const { message } = err;
        setIsProceed(false);
        setIsUpdate(false);
        setSnackbarData({
          message,
          role: SnackbarRole.Error,
        });
        setSnackbarOpen(true);
      },
    });

  const closeUpdateHandler = () => {
    setIsUpdate(false);
    setBoardTitleInput(title);
    setBoardDescriptionInput(description ? description : undefined);
  };

  const applyUpdateHandler = () => {
    setIsProceed(true);
    updateListboard({
      data: {
        id,
        title: boardTitleInput !== title ? boardTitleInput : undefined,
        description:
          boardDescriptionInput !== description
            ? boardDescriptionInput
            : undefined,
      },
    });
  };

  const applyDeleteHandler = () => {
    setIsProceed(true);
    deleteListboard({ data: { id } });
  };

  const ButtonRender = () => {
    if (isUpdate) {
      return (
        <>
          <CircleButton
            onClick={applyUpdateHandler}
            className="ml-1 h-6 w-6 rounded-md bg-emerald-500/50 hover:bg-emerald-500"
            info="apply"
          >
            <CheckIcon className="h-4 w-4" />
          </CircleButton>
          <CircleButton
            onClick={closeUpdateHandler}
            className="ml-1 h-6 w-6 rounded-md bg-red-500/50 hover:bg-red-500"
            info="cancel"
          >
            <ClearIcon className="h-4 w-4" />
          </CircleButton>
        </>
      );
    }

    return (
      <>
        <CircleButton
          info="Edit listboard title"
          onClick={() => {
            setIsUpdate(true);
          }}
          className="ml-1 h-6 w-6 rounded-md bg-orange-300 hover:bg-orange-400 dark:bg-orange-400 dark:hover:bg-orange-500"
        >
          <EditIcon className="h-4 w-4" />
        </CircleButton>
        <CircleButton
          onClick={() => {
            if (window.confirm("Deleting Listboard")) {
              applyDeleteHandler();
            }
          }}
          info="Delete listboard"
          className="ml-1 h-6 w-6 rounded-md bg-red-300 p-0 hover:bg-red-400 dark:bg-red-400 dark:hover:bg-red-500"
        >
          <TrashIcon className="h-4 w-4" fill="white" />
        </CircleButton>
      </>
    );
  };

  const InfoRender = () => {
    return (
      <>
        <p className="text-md font-semibold text-neutral-700 dark:text-white sm:text-lg">
          {title}
        </p>
        <p className="my-2 px-8 text-xs font-light text-neutral-700 dark:text-white sm:text-sm">
          {description}
        </p>
      </>
    );
  };

  return (
    <div
      onTransitionEnd={onTransitionEnd}
      className={`absolute left-0 top-0 flex h-screen w-screen items-center justify-center transition-all duration-150 will-change-auto ${
        isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
      }`}
    >
      <ClickAwayListener
        onClickAway={() => {
          popperClose();
        }}
      >
        <div className="relative flex h-4/5 w-5/6 flex-col items-center rounded-2xl bg-neutral-200/70 pb-2 backdrop-blur-sm dark:bg-neutral-800/90 sm:h-2/3 sm:w-2/3 sm:max-w-[800px]">
          <div className="my-4 flex w-full flex-col items-center justify-center">
            {InfoRender()}
          </div>
          <div className="flex h-2/3 w-[90%] items-center justify-center">
            {todos.length ? (
              <ListView>
                {todos.map((todo) => {
                  return <TodoItem data={todo} key={todo.id} />;
                })}
              </ListView>
            ) : (
              <NoItems />
            )}
          </div>
          <div className="absolute bottom-5 flex justify-center">
            <Button
              onClick={() => {
                popperClose();
              }}
            >
              close
            </Button>
          </div>
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default ListboardPopper;

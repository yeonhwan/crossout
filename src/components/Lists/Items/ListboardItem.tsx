// React, hooks
import { type Dispatch, type SetStateAction, useState } from "react";

// components
import CircleButton from "@/components/Buttons/CircleButton";
import ListView from "@/components/Lists/ListView";

//ICONS
import TrashIcon from "public/icons/trash.svg";
import LoaderIcon from "public/icons/spinner.svg";

// types
import { type ListboardItemType } from "@/types/client";

// store
import useSnackbarStore from "@/stores/useSnackbarStore";
import { SnackbarRole } from "@/stores/useSnackbarStore";

// api
import { api } from "@/utils/api";

type ListboardItemProps = {
  data: ListboardItemType;
  popperOpen: () => void;
  setPopperData: Dispatch<SetStateAction<ListboardItemType | null>>;
  setIsProceed: Dispatch<SetStateAction<boolean>>;
};

const ListboardItem = ({
  data,
  popperOpen,
  setPopperData,
  setIsProceed,
}: ListboardItemProps) => {
  const [isActive, setIsActive] = useState(false);
  const utils = api.useContext();
  const { setSnackbarOpen, setSnackbarData } = useSnackbarStore(
    (state) => state
  );
  const { id } = data;

  const { mutate: deleteListboard, isLoading } =
    api.listboards.deleteListboard.useMutation({
      onSuccess: async (res) => {
        const { message, content } = res;
        await utils.listboards.getListboards.invalidate();
        setSnackbarData({
          message,
          content,
          role: SnackbarRole.Success,
        });
        setIsProceed(false);
        setSnackbarOpen(true);
      },
      onError: (err) => {
        const { message } = err;
        setSnackbarData({
          message,
          role: SnackbarRole.Error,
        });
        setIsProceed(false);
        setSnackbarOpen(true);
      },
    });

  const itemMouseDownHandler = () => {
    setPopperData(data);
    setIsActive(false);
    popperOpen();
  };

  const deleteListboardHandler = (
    e: React.MouseEvent<HTMLButtonElement> | undefined
  ) => {
    e?.stopPropagation();
    if (window.confirm("Deleting Listboard")) {
      setIsProceed(true);
      deleteListboard({ data: { id } });
    }
  };

  return (
    <div
      className={`min-h-[250px] min-w-[280px] max-w-2xl rounded-3xl border-2 border-neutral-200 bg-neutral-300 shadow-xl transition-all duration-75 hover:cursor-pointer dark:border-neutral-700 dark:bg-neutral-700/60 ${
        isActive ? "scale-[95%]" : ""
      }`}
      onMouseDown={() => {
        setIsActive(true);
      }}
      onMouseUp={itemMouseDownHandler}
    >
      <div className="flex h-2/3 w-full items-center justify-between rounded-t-3xl border-b-2 border-b-neutral-400 bg-neutral-200 px-2 py-3 dark:border-b-neutral-700 dark:bg-neutral-500">
        <p className="text-neutral-700 dark:text-white">{data.title}</p>
        <div className="flex">
          {isLoading ? (
            <LoaderIcon className="h-6 w-6 fill-neutral-600 dark:fill-white" />
          ) : (
            <CircleButton
              onClick={deleteListboardHandler}
              info="Delete listboard"
              className="mr-1 h-6 w-6 rounded-md bg-red-300 p-0 hover:bg-red-400 dark:bg-red-400 dark:hover:bg-red-500"
            >
              <TrashIcon className="h-3 w-3" fill="white" />
            </CircleButton>
          )}
        </div>
      </div>
      <div className="flex h-full w-full flex-col px-2 py-1">
        <p className="text-xs text-neutral-300">{data.description}</p>
        <div className="mt-2 flex max-h-[150px] flex-col">
          <ListView className="items-start px-2">
            {data.todos.length ? (
              data.todos.map((todo) => <li key={todo.id}>{todo.content}</li>)
            ) : (
              <li>Empty Listboard</li>
            )}
          </ListView>
        </div>
      </div>
    </div>
  );
};

export default ListboardItem;

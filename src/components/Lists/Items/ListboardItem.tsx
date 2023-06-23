// Hooks
import { useState, useRef } from "react";
import { useWindowWidth } from "@/hooks/useWindowWidth";

// components
import CircleButton from "@/components/Buttons/CircleButton";
import ListView from "@/components/Lists/ListView";
import TodoItem from "@/components/Lists/Items/TodoItem";
import NoItems from "@/components/Graphic/NoItems";
import Button from "@/components/Buttons/Button";

//ICONS
import TrashIcon from "public/icons/trash.svg";
import LoaderIcon from "public/icons/spinner.svg";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

// types
import { type ListboardItemType } from "@/types/client";
import { type Dispatch, type SetStateAction } from "react";

// store
import useSnackbarStore from "@/stores/useSnackbarStore";
import { SnackbarRole } from "@/stores/useSnackbarStore";

// libs
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import ClickAwayListener from "@mui/base/ClickAwayListener";

// api
import { api } from "@/utils/api";

type ListboardItemProps = {
  data: ListboardItemType;
  setIsProceed: Dispatch<SetStateAction<boolean>>;
  setMaskOn: Dispatch<SetStateAction<boolean>>;
  setBackDropOpen: Dispatch<SetStateAction<boolean>>;
};

const ListboardItem = ({
  data,
  setIsProceed,
  setBackDropOpen,
  setMaskOn,
}: ListboardItemProps) => {
  const [titleUpdate, setTitleUpdate] = useState(false);
  const [descriptionUpdate, setDescriptionUpdate] = useState(false);
  const [titleInput, setTitleInput] = useState(data.title);
  const [descriptionInput, setDescriptionInput] = useState(
    data.description ? data.description : ""
  );
  const [isOpen, setIsOpen] = useState(false);
  const isOverSmall = useWindowWidth(true, 640);
  const prevItemY = useRef<number>();

  const utils = api.useContext();
  const { setSnackbarOpen, setSnackbarData, setSnackbarLoadingState } =
    useSnackbarStore((state) => state);
  const previousData = useRef({
    data: {
      id: data.id,
      title: data.title,
      description: data.description,
    },
  });
  const [scope, animate] = useAnimate();

  const { mutate: abortUpdateListboard } =
    api.listboards.updateListboard.useMutation({
      onSuccess: async (res) => {
        await utils.listboards.getListboards.invalidate();
        const listboard = res.data;
        setSnackbarLoadingState(false);
        setSnackbarOpen(true);
        const currentListboard = {
          data: {
            id: listboard.id,
            title: listboard.title,
            description: listboard.description,
          },
        };
        previousData.current = currentListboard;
        setSnackbarData({
          message: "Canceld update listboard",
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

  const { mutate: deleteListboard, isLoading: deleteListboardLoading } =
    api.listboards.deleteListboard.useMutation({
      onSuccess: async (res) => {
        const { content } = res;
        await utils.listboards.getListboards.invalidate();
        setIsProceed(false);
        setSnackbarOpen(true);
        setSnackbarData({
          message: "Deleted listboard",
          content,
          role: SnackbarRole.Success,
        });
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

  const { isLoading: isTitleLoading, mutate: updateListboardTitle } =
    api.listboards.updateListboard.useMutation({
      onSuccess: async (res) => {
        await utils.listboards.getListboards.invalidate();
        const { content, data: listboard } = res;
        setTitleUpdate(false);
        setSnackbarData({
          message: "Updated title",
          content,
          role: SnackbarRole.Success,
          previousData: {
            data: {
              id: previousData.current.data.id,
              title: previousData.current.data.title,
            },
          },
          handler: (data) => {
            setSnackbarLoadingState(true);
            abortUpdateListboard(
              data as {
                data: {
                  id: number;
                  title: string;
                };
              }
            );
          },
        });
        const currentListboard = {
          data: {
            id: listboard.id,
            title: listboard.title,
            description: listboard.description,
          },
        };
        previousData.current = currentListboard;
        setSnackbarOpen(true);
      },
      onError: (err) => {
        const { message } = err;
        setTitleUpdate(false);
        setSnackbarData({
          message,
          role: SnackbarRole.Error,
        });
        setSnackbarOpen(true);
      },
    });

  const {
    isLoading: isDescriptionLoading,
    mutate: updateListboardDescription,
  } = api.listboards.updateListboard.useMutation({
    onSuccess: async (res) => {
      await utils.listboards.getListboards.invalidate();
      const { content, data: listboard } = res;
      setDescriptionUpdate(false);
      setSnackbarData({
        message: "Updated description",
        content,
        role: SnackbarRole.Success,
        previousData: {
          data: {
            id: previousData.current.data.id,
            description: previousData.current.data.description,
          },
        },
        handler: (data) => {
          setSnackbarLoadingState(true);
          abortUpdateListboard(
            data as {
              data: {
                id: number;
                description: string;
              };
            }
          );
        },
      });
      const currentListboard = {
        data: {
          id: listboard.id,
          title: listboard.title,
          description: listboard.description,
        },
      };
      previousData.current = currentListboard;
      setSnackbarOpen(true);
    },
    onError: (err) => {
      const { message } = err;
      setDescriptionUpdate(false);
      setSnackbarData({
        message,
        role: SnackbarRole.Error,
      });
      setSnackbarOpen(true);
    },
  });

  const deleteListboardHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (window.confirm("Deleting Listboard")) {
      setIsProceed(true);
      deleteListboard({ data: { id: data.id } });
    }
  };

  const itemOpenHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!titleUpdate && !descriptionUpdate && !isOpen) {
      setIsOpen(true);
      setMaskOn(false);
      setBackDropOpen(true);
      const itemRect = e.currentTarget.getClientRects()[0] as DOMRect;
      const scrollTop = (
        document.querySelector(".overflow-scroll") as HTMLElement
      ).scrollTop;
      const x = isOverSmall
        ? window.innerWidth / 2 - (itemRect.width * 0.5 + itemRect.x)
        : 0;
      const y =
        window.innerHeight / 2 -
        (itemRect.height + itemRect.y) -
        scrollTop -
        40;
      const itemWidth = isOverSmall
        ? itemRect.width + 380
        : window.innerWidth * 0.8;
      const itemHeight = isOverSmall
        ? itemRect.height + 400
        : 0.7 * window.innerHeight;
      animate(
        scope.current,
        { x, y: [-scrollTop, y], width: itemWidth, height: itemHeight },
        { duration: 0.2 }
      )
        .then(() => {
          prevItemY.current = y;
          return;
        })
        .catch(() => {
          return;
        });
    }
  };

  const itemCloseHandler = () => {
    setIsOpen(false);
    const scrollTop = (
      document.querySelector(".overflow-scroll") as HTMLElement
    ).scrollTop;
    setBackDropOpen(false);
    animate(
      scope.current,
      {
        x: 0,
        y: [prevItemY.current ? prevItemY.current + scrollTop : 0, 0],
        width: isOverSmall ? "320px" : "256px",
        height: "250px",
      },
      { duration: 0.2 }
    )
      .then(() => {
        const itemEls = document.querySelectorAll<HTMLElement>(".item");
        itemEls.forEach((itemEl) => {
          itemEl.style.width = "";
          itemEl.style.height = "";
        });
      })
      .catch(() => {
        return;
      });
  };

  return (
    <div
      className={`group flex h-[250px] w-[320px] justify-center sm:min-h-[250px] sm:w-[320px] sm:min-w-[200px] sm:max-w-[350px]`}
    >
      <div
        ref={scope}
        className={`item h-[250px] w-[256px] rounded-3xl border-2 border-neutral-200 bg-neutral-300 shadow-xl dark:border-neutral-700 dark:bg-neutral-700/60 sm:h-[250px] sm:w-[320px] ${
          isOpen
            ? "absolute z-50"
            : "z-0 hover:cursor-pointer group-hover:border-teal-300"
        }`}
        onClick={itemOpenHandler}
      >
        <AnimatePresence mode="wait">
          {isOpen && (
            <ClickAwayListener onClickAway={itemCloseHandler}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full w-full flex-col items-center justify-start rounded-3xl bg-neutral-200/70 py-4 backdrop-blur-sm dark:bg-neutral-800/90"
              >
                <div className="flex h-[10%] w-full flex-col items-center justify-center">
                  <p className="text-md font-semibold text-neutral-700 dark:text-white sm:text-lg">
                    {data.title}
                  </p>
                  <p className="my-2 px-8 text-xs font-light text-neutral-700 dark:text-white sm:text-sm">
                    {data.description}
                  </p>
                </div>
                <div className="my-auto flex h-[80%] w-[90%] items-center justify-center sm:h-[70%]">
                  {data.todos.length ? (
                    <ListView>
                      {data.todos.map((todo) => {
                        return <TodoItem data={todo} key={todo.id} />;
                      })}
                    </ListView>
                  ) : (
                    <NoItems />
                  )}
                </div>
                <div className="my-auto flex justify-center">
                  <Button
                    className="hover:bg-teal-400 dark:hover:bg-teal-500"
                    onClick={itemCloseHandler}
                  >
                    close
                  </Button>
                </div>
              </motion.div>
            </ClickAwayListener>
          )}
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full w-full flex-col"
            >
              <div
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setTitleUpdate(false);
                  }
                }}
                className="flex h-1/5 w-full items-center justify-between rounded-t-3xl border-b-2 border-b-neutral-400 bg-neutral-200 px-2 py-3 dark:border-b-neutral-700 dark:bg-neutral-500"
              >
                {titleUpdate ? (
                  <input
                    autoFocus
                    className={`sm:text-md h-full w-[80%] border-0 px-2 py-2 text-sm text-neutral-700 shadow-lg ring-2 ring-transparent focus:outline-none dark:bg-neutral-600 dark:text-neutral-200 dark:placeholder:text-white sm:py-0 ${
                      titleInput.length <= 0
                        ? "focus:ring-red-400 dark:focus:ring-red-400"
                        : "focus:ring-teal-400 dark:focus:ring-teal-500"
                    }}`}
                    value={titleInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setTitleInput(e.currentTarget.value);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onMouseUp={(e) => {
                      e.stopPropagation();
                    }}
                  />
                ) : (
                  <p className="sm:text-md w-[80%] overflow-hidden text-ellipsis whitespace-nowrap text-sm text-neutral-700 dark:text-white">
                    {data.title}
                  </p>
                )}
                <div className="flex w-14 justify-evenly">
                  {isTitleLoading ? (
                    <LoaderIcon className="h-6 w-6 fill-neutral-600 dark:fill-white" />
                  ) : titleUpdate ? (
                    <>
                      <CircleButton
                        onClick={(e) => {
                          e?.stopPropagation();
                          updateListboardTitle({
                            data: { id: data.id, title: titleInput },
                          });
                        }}
                        className={`ml-1 h-5 w-5 rounded-md hover:bg-emerald-500 dark:hover:bg-emerald-400/70 ${
                          titleInput.length <= 0
                            ? "pointer-events-none bg-neutral-400 dark:bg-neutral-600"
                            : "bg-emerald-500/50 dark:bg-emerald-400/70"
                        }`}
                        info="apply"
                      >
                        <CheckIcon className="h-3 w-3" />
                      </CircleButton>
                      <CircleButton
                        onClick={() => {
                          setTitleUpdate(false);
                          setTitleInput(data.title);
                        }}
                        className="ml-1 h-5 w-5 rounded-md bg-red-500/50 hover:bg-red-500 dark:bg-red-400/70 dark:hover:bg-red-400/70"
                        info="cancel"
                      >
                        <ClearIcon className="h-3 w-3" />
                      </CircleButton>
                    </>
                  ) : deleteListboardLoading ? (
                    <LoaderIcon className="h-6 w-6 fill-neutral-600 dark:fill-white" />
                  ) : (
                    <>
                      <CircleButton
                        info="Edit listboard title"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTitleUpdate(true);
                        }}
                        className="h-5 w-5 rounded-md bg-orange-300 hover:bg-orange-400 dark:bg-orange-400 dark:hover:bg-orange-500"
                      >
                        <EditIcon className="h-3 w-3" />
                      </CircleButton>
                      <CircleButton
                        onClick={deleteListboardHandler}
                        info="Delete listboard"
                        className="h-5 w-5 rounded-md bg-red-300 p-0 hover:bg-red-400 dark:bg-red-400 dark:hover:bg-red-500"
                      >
                        <TrashIcon className="h-3 w-3" fill="white" />
                      </CircleButton>
                    </>
                  )}
                </div>
              </div>
              <div className="flex h-full w-full flex-col px-2 py-1">
                {data.description ? (
                  <div className="flex items-center">
                    {descriptionUpdate ? (
                      <div
                        id="description_container"
                        onBlur={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget)) {
                            setDescriptionUpdate(false);
                          }
                        }}
                        tabIndex={-1}
                        className={`relative flex h-14 w-full flex-col items-center rounded-md bg-neutral-200 ring-2 ring-neutral-400 dark:bg-neutral-600 dark:ring-neutral-500 ${
                          descriptionInput.length > 50
                            ? "focus-within:ring-red-400 dark:focus-within:ring-red-400"
                            : "focus-within:ring-teal-400 dark:focus-within:ring-teal-500"
                        }`}
                      >
                        <textarea
                          className="h-10 w-full resize-none rounded-md border-0 bg-neutral-200 px-2 py-1 text-xs text-neutral-700 ring-neutral-300 focus:outline-none dark:bg-neutral-600 dark:text-neutral-200 dark:ring-neutral-500 dark:placeholder:text-white"
                          value={descriptionInput}
                          autoFocus
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => {
                            setDescriptionInput(e.currentTarget.value);
                          }}
                          cols={2}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                          }}
                          onMouseUp={(e) => {
                            e.stopPropagation();
                          }}
                        />
                        <div className="absolute bottom-1 right-0 mr-2 flex self-end">
                          {isDescriptionLoading ? (
                            <LoaderIcon className="h-4 w-4 fill-neutral-600 dark:fill-white" />
                          ) : (
                            ""
                          )}
                          <span className="mr-1 text-[8px] text-neutral-700 dark:text-neutral-200">{`${descriptionInput.length} / 50`}</span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              updateListboardDescription({
                                data: {
                                  id: data.id,
                                  description: descriptionInput,
                                },
                              });
                            }}
                            className={`flex h-4 w-4 items-center justify-center rounded-full hover:cursor-pointer hover:bg-emerald-300 ${
                              descriptionInput.length > 50 &&
                              isDescriptionLoading
                                ? "pointer-events-none"
                                : ""
                            }`}
                          >
                            <CheckIcon
                              className={`h-3 w-3 fill-white ${
                                descriptionInput.length > 50
                                  ? "fill-red-400"
                                  : "fill-white"
                              }`}
                            />
                          </span>
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full hover:cursor-pointer hover:bg-red-300 ${
                              isDescriptionLoading ? "pointer-events-none" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDescriptionUpdate(false);
                              setDescriptionInput(
                                data.description ? data.description : ""
                              );
                            }}
                          >
                            <ClearIcon className="h-3 w-3 fill-white" />
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="w-max max-w-[90%] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-neutral-500 dark:text-neutral-300">
                          {data.description}
                        </p>
                        <span
                          className="group/icon ml-1 flex h-4 w-4 items-center justify-center rounded-full transition-none hover:cursor-pointer hover:bg-neutral-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDescriptionUpdate(true);
                          }}
                        >
                          <EditIcon className="h-3 w-3 fill-neutral-500 transition-none group-hover/icon:fill-neutral-300 dark:fill-neutral-300" />
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  ""
                )}
                <div
                  className={`mt-2 flex ${
                    descriptionUpdate ? "h-1/2" : "h-2/3"
                  } flex-col`}
                >
                  <ListView className="items-start px-2 pt-2">
                    {data.todos.length ? (
                      data.todos.map((todo) => (
                        <li
                          className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-200"
                          key={todo.id}
                        >
                          {todo.content}
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-700 dark:text-neutral-200">
                        Empty Listboard
                      </p>
                    )}
                  </ListView>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ListboardItem;

// React
import React, {
  type ForwardedRef,
  forwardRef,
  type Dispatch,
  type SetStateAction,
} from "react";

// hooks
import { useState } from "react";

// Components
import Button from "@/components/Buttons/Button";

// Icons
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

// api
import { api } from "@/utils/api";
import LoaderIcon from "public/icons/spinner.svg";

import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

type ListboardsProps = {
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

const ListboardsForm = (
  { setOpenDialog }: ListboardsProps,
  ref: ForwardedRef<HTMLFormElement>
) => {
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [isProceed, setIsProceed] = useState(false);
  const { setSnackbarOpen, setSnackbarData, setSnackbarLoadingState } =
    useSnackbarStore((state) => state);
  const utils = api.useContext();

  const cancelButtonHandler = () => {
    setTitleInput("");
    setOpenDialog(false);
  };

  const { mutate: abortCreateListboard } =
    api.listboards.deleteListboard.useMutation({
      onSuccess: async () => {
        setSnackbarLoadingState(false);
        await utils.listboards.getListboards.invalidate();
        setSnackbarOpen(true);
        setSnackbarData({
          message: "Canceld create new listboard",
          role: SnackbarRole.Success,
        });
      },
      onError: (err) => {
        const { message } = err;
        setSnackbarOpen(true);
        setSnackbarData({ message, role: SnackbarRole.Error });
      },
    });

  const { mutate: createListboard } =
    api.listboards.createListboard.useMutation({
      onSuccess: async (res) => {
        const { data, content } = res.data;
        setSnackbarData({
          role: SnackbarRole.Success,
          message: "New listboard",
          content,
          previousData: { data: { id: data.id } },
          handler: (data) => {
            setSnackbarLoadingState(true);
            abortCreateListboard(data as { data: { id: number } });
          },
        });
        setSnackbarOpen(true);
        await utils.listboards.getListboards.invalidate();
        setIsProceed(false);
        setOpenDialog(false);
      },
      onError: (err) => {
        const { message } = err;
        setSnackbarOpen(true);
        setSnackbarData({ message, role: SnackbarRole.Error });
      },
    });

  const confirmOnClickHandler = () => {
    createListboard({
      data: { title: titleInput, description: descriptionInput },
    });
    setIsProceed(true);
  };

  return (
    <form
      ref={ref}
      className="flex h-4/5 max-h-[550px] min-h-[500px] w-[90%] flex-col items-center justify-around rounded-lg bg-neutral-200/40 text-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-200 sm:min-h-[500px] sm:w-1/4 sm:min-w-[500px]"
    >
      <div className="flex h-[10%] flex-col items-center justify-center pt-8">
        <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/50 p-2 dark:bg-teal-500/50">
          <ContentPasteIcon className="h-6 w-6 fill-white" />
        </span>
        <h1 className="ml-1 text-lg font-bold sm:text-xl">New Listboard</h1>
        <p className="text-xs text-neutral-700 dark:text-neutral-200">
          <span className="text-red-400">*</span>
          should be filled in to submit
        </p>
      </div>
      <div className="flex h-[45%] w-2/3 flex-col justify-center">
        <div className="mb-2 flex flex-col justify-center focus-within:text-teal-600 dark:focus-within:text-teal-400">
          <label
            className="rounded-md font-semibold after:text-red-400 after:content-['*']"
            htmlFor="title"
          >
            Listboard title
          </label>
          <input
            className="mb-2 border-0 px-2 py-1 text-neutral-700 shadow-lg ring-2 ring-neutral-300 focus:outline-none focus:ring-teal-400 dark:bg-neutral-600 dark:text-neutral-200 dark:ring-neutral-500 dark:placeholder:text-white dark:focus:ring-teal-500"
            id="title"
            placeholder="Type in your listboard title"
            value={titleInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTitleInput(e.currentTarget.value);
            }}
          />
        </div>
        <div className="flex flex-col justify-center focus-within:text-teal-600 dark:focus-within:text-teal-400">
          <label className="font-semibold" htmlFor="deadline">
            Describe your listboard
          </label>
          <p className="mb-3 text-xs">Describes should be less 50 characters</p>
          <textarea
            placeholder="Describe your listboard"
            className={`${
              descriptionInput.length > 50
                ? "focus:ring-red-400 dark:focus:ring-red-300"
                : "focus:ring-teal-400 dark:focus:ring-teal-500"
            } mb-2 resize-none rounded-md border-0 px-2 py-1 text-neutral-700 shadow-lg ring-2 ring-neutral-300 focus:outline-none dark:bg-neutral-600 dark:text-neutral-200 dark:ring-neutral-500 dark:placeholder:text-white dark:focus:ring-teal-500`}
            id="description"
            cols={2}
            value={descriptionInput}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setDescriptionInput(e.currentTarget.value);
            }}
          />
          <span
            className={`self-end text-xs ${
              descriptionInput.length > 50 ? "text-red-400" : ""
            }`}
          >{`${descriptionInput.length} / 50`}</span>
        </div>
      </div>
      <div className="flex h-[10%]">
        {isProceed ? (
          <Button className="pointer-events-none flex h-10 items-center justify-center px-4 hover:bg-neutral-400 dark:hover:bg-neutral-700">
            <LoaderIcon className="h-6 w-6 fill-white" />
          </Button>
        ) : (
          <>
            <Button
              className={`h-8 hover:text-white ${
                titleInput.length <= 0 || descriptionInput.length > 50
                  ? "pointer-events-none bg-neutral-400 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-800"
                  : ""
              }`}
              onClick={confirmOnClickHandler}
            >
              Confirm
            </Button>
            <Button
              className="h-8 hover:bg-red-400 hover:text-white dark:hover:bg-red-500"
              onClick={cancelButtonHandler}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default forwardRef(ListboardsForm);

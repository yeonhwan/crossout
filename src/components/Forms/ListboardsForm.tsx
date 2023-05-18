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

// api
import { api } from "@/utils/api";

// styles
import loader_styles from "@/styles/loader.module.css";
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

// Props TYPE
type TodoFormProps = {
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

type SnackbarHandlerType = (data: object) => void;

function ListboardsForm(
  { setOpenDialog }: TodoFormProps,
  ref: ForwardedRef<HTMLFormElement>
) {
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [isProceed, setIsProceed] = useState(false);
  const { setSnackbarOpen, setSnackbarData } = useSnackbarStore(
    (state) => state
  );
  const utils = api.useContext();

  const cancelButtonHandler = () => {
    setTitleInput("");
    setOpenDialog(false);
  };

  const { mutate: abortCreateListboard } = api.todo.deleteTodo.useMutation({
    onSuccess: async (res) => {
      const { message, content } = res.data;
      await utils.todo.getTodos.invalidate();
      await utils.listboards.getListboards.invalidate();
      setSnackbarOpen(true);
      setSnackbarData({ message, content, role: SnackbarRole.Success });
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
        const { data, message, content } = res.data;
        setSnackbarData({
          role: SnackbarRole.Success,
          message,
          content,
          previousData: { data: { id: data.id } },
          // handler: abortCreateTodo as SnackbarHandlerType,
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
      className="flex h-2/3 w-1/3 flex-col items-center justify-evenly rounded-lg bg-neutral-400/40 py-4"
    >
      <h1 className="text-2xl font-bold">New Listboard</h1>
      <div className="flex w-2/3 flex-col">
        <label className="text-lg font-semibold" htmlFor="title">
          What is your listboard title?
        </label>
        <input
          className="mb-2 px-2 py-1"
          id="title"
          placeholder="Type in your listboard title"
          value={titleInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTitleInput(e.currentTarget.value);
          }}
        />
        <label className="text-lg font-semibold" htmlFor="deadline">
          Describe your listboard
        </label>
        <textarea
          placeholder="Describe your listboard"
          className="mb-2 px-2 py-1"
          id="description"
          value={descriptionInput}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setDescriptionInput(e.currentTarget.value);
          }}
        />
      </div>
      <div className="flex">
        {isProceed ? (
          <Button className="pointer-events-none flex justify-center px-4">
            <span className="flex h-full w-full items-center justify-center">
              <span className={`${loader_styles.loader as string}`} />
            </span>
          </Button>
        ) : (
          <>
            <Button onClick={confirmOnClickHandler}>Confirm</Button>
            <Button onClick={cancelButtonHandler}>Cancel</Button>
          </>
        )}
      </div>
    </form>
  );
}

export default forwardRef(ListboardsForm);

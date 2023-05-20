// React, hooks
import { useState } from "react";
import { useAnimation } from "@/hooks/useAnimation";

// components
import ListView from "@/components/Lists/ListView";
import ListboardItem from "@/components/Lists/Items/ListboardItem";
import CircleButton from "@/components/Buttons/CircleButton";
import Dialog from "@/components/Dialog/Dialog";
import ListboardsForm from "@/components/Forms/ListboardsForm";
import ListboardPopper from "@/components/Popper/ListboardPopper";
import NoListboards from "@/components/Graphic/NoListboards";

// api
import { api } from "@/utils/api";

// styles
import loader_styles from "@/styles/loader.module.css";

// types
import { type ListboardItemType } from "@/types/client";

// ICONS
import AddCardIcon from "@mui/icons-material/AddCard";

const ListboardIndex = () => {
  const [isOpenListboardsDialog, setIsOpenListboardsDialog] = useState(false);
  const [listboardsData, setListboardsData] = useState<
    ListboardItemType[] | undefined
  >();
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [shouldRender, animateTrigger, handleTransition] =
    useAnimation(isPopperOpen);

  const [popperData, setPopperData] = useState<ListboardItemType | null>(null);
  const [isProceed, setIsProceed] = useState(false);

  const openCreateListboard = () => {
    setIsOpenListboardsDialog(true);
  };

  api.listboards.getListboards.useQuery(
    { data: { todos: true } },
    {
      queryKey: ["listboards.getListboards", { data: { todos: true } }],
      onSuccess: (res) => {
        const { data } = res;
        setListboardsData(data as ListboardItemType[]);
        data.forEach((todo) => {
          if (todo.id === popperData?.id) {
            setPopperData(todo as ListboardItemType);
          }
        });
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const itemRender = () => {
    if (listboardsData && listboardsData.length) {
      return (
        <>
          <ListView className="mt-5 grid grid-cols-listboard items-start justify-around gap-x-5 gap-y-8">
            {listboardsData.map((data) => (
              <ListboardItem
                popperOpen={() => {
                  setIsPopperOpen(true);
                }}
                setPopperData={setPopperData}
                data={data}
                key={data.id}
                setIsProceed={setIsProceed}
              />
            ))}
          </ListView>
          <div className="flex self-end">
            <CircleButton
              className=""
              info="Add new listboard"
              onClick={openCreateListboard}
            >
              <AddCardIcon />
            </CircleButton>
          </div>
        </>
      );
    } else if (listboardsData && !listboardsData.length) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <NoListboards
            buttonHandler={() => {
              setIsOpenListboardsDialog(true);
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <span className="flex items-center justify-center">
            <span className={`ml-2 ${loader_styles.loader as string}`} />
          </span>
        </div>
      );
    }
  };

  return (
    <div className="flex h-full w-full flex-col px-40">
      <h1 className="text-4xl font-extrabold text-neutral-300">Listboards</h1>
      <p className="text-lg font-semibold text-neutral-700">
        Manage your listboards and todos in here!
      </p>
      <div className="mt-4 flex h-[80%] max-h-[600px] w-full flex-col justify-center rounded-xl bg-neutral-400/40 px-10 py-5 pt-10 backdrop-blur-lg">
        {isProceed && (
          <div className="absolute right-4 top-4 h-max w-max">
            <span className="flex h-8 w-8 items-center justify-center">
              <span className={`${loader_styles.loader as string}`} />
            </span>
          </div>
        )}
        {itemRender()}
      </div>
      <Dialog
        onClickAway={() => {
          setIsOpenListboardsDialog(false);
        }}
        openState={isOpenListboardsDialog}
      >
        <ListboardsForm setOpenDialog={setIsOpenListboardsDialog} />
      </Dialog>
      {shouldRender && (
        <ListboardPopper
          isOpen={animateTrigger}
          popperClose={() => {
            setIsPopperOpen(false);
          }}
          onTransitionEnd={handleTransition}
          data={popperData}
        />
      )}
    </div>
  );
};

export default ListboardIndex;

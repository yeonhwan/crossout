// React
import { useState } from "react";

// components
import ListView from "@/components/Lists/ListView";
import ListboardItem from "@/components/Lists/Items/ListboardItem";
import CircleButton from "@/components/Buttons/CircleButton";
import Dialog from "@/components/Dialog/Dialog";
import ListboardsForm from "@/components/Forms/ListboardsForm";

// api
import { api } from "@/utils/api";

// styles
import loader_styles from "@/styles/loader.module.css";

// types
import { type ListBoard, type Todo } from "@prisma/client";

// ICONS
import AddCardIcon from "@mui/icons-material/AddCard";

export type ListboardsDataType = ListBoard & {
  todos: Todo[];
};

export default function ListboardIndex() {
  const [isOpenListboardsDialog, setIsOpenListboardsDialog] = useState(false);
  const [listboardsData, setListboardsData] = useState<ListboardsDataType[]>(
    []
  );

  const openCreateListboard = () => {
    setIsOpenListboardsDialog(true);
  };

  const { isLoading } = api.listboards.getListboards.useQuery(undefined, {
    queryKey: ["listboards.getListboards", undefined],
    onSuccess: (res) => {
      const { data } = res;
      setListboardsData(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const itemRender = () => {
    if (listboardsData.length) {
      return listboardsData.map((data) => {
        return <ListboardItem data={data} key={data.id} />;
      });
    } else {
      return <p>null</p>;
    }
  };

  return (
    <div className="flex h-full w-full flex-col px-40">
      <h1 className="text-4xl font-extrabold text-neutral-300">Listboards</h1>
      <p className="text-lg font-semibold text-neutral-700">
        Manage your listboards and todos in here!
      </p>
      <div className="relative mt-4 flex h-[80%] max-h-[600px] w-full flex-col justify-center rounded-xl bg-neutral-400/40 px-10 py-5 backdrop-blur-md">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <span className="flex items-center justify-center">
              <span className={`ml-2 ${loader_styles.loader as string}`} />
            </span>
          </div>
        ) : (
          <ListView className="mt-5 grid grid-cols-listboard items-start justify-around gap-x-5 gap-y-8">
            {itemRender()}
          </ListView>
        )}
        <CircleButton
          className="absolute bottom-5 right-5"
          info="Add new listboard"
          clickHandler={openCreateListboard}
        >
          <AddCardIcon />
        </CircleButton>
      </div>
      <Dialog
        onClickAway={() => {
          setIsOpenListboardsDialog(false);
        }}
        openState={isOpenListboardsDialog}
      >
        <ListboardsForm setOpenDialog={setIsOpenListboardsDialog} />
      </Dialog>
    </div>
  );
}

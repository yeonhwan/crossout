// components
import ListView from "@/components/Lists/ListView";
import ListboardItem from "@/components/Lists/Items/ListboardItem";
import CircleButton from "@/components/Buttons/CircleButton";

// ICONS
import AddCardIcon from "@mui/icons-material/AddCard";

export default function ListboardIndex() {
  return (
    <div className="flex h-full w-full flex-col px-40">
      <h1 className="text-4xl font-extrabold text-neutral-300">Listboards</h1>
      <p className="text-lg font-semibold text-neutral-700">
        Manage your listboards and todos in here!
      </p>
      <div className="relative mt-4 flex h-[80%] max-h-[600px] w-full flex-col justify-center rounded-xl bg-neutral-400/40 px-10 py-5 backdrop-blur-md">
        <ListView className="mt-5 grid grid-cols-listboard items-start justify-around gap-x-5 gap-y-5">
          <ListboardItem />
          <ListboardItem />
          <ListboardItem />
          <ListboardItem />
        </ListView>
        <CircleButton
          className="absolute bottom-5 right-5"
          info="Add new listboard"
        >
          <AddCardIcon />
        </CircleButton>
      </div>
    </div>
  );
}

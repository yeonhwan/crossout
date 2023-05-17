// components
import CircleButton from "@/components/Buttons/CircleButton";
import ListView from "../ListView";

//ICONS
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ListboardItem() {
  return (
    <div className="min-h-[250px] min-w-[280px] max-w-2xl rounded-3xl border-2 border-neutral-700 bg-neutral-700/60 shadow-xl transition-all duration-75 hover:cursor-pointer active:scale-[95%]">
      <div className="flex h-2/3 w-full items-center justify-between rounded-t-3xl border-b-2 border-b-neutral-700 bg-neutral-500 px-2 py-3">
        <p className="text-white">Title Goes Here....</p>
        <div className="flex">
          <CircleButton info="Edit listboard" className="mr-1 h-6 w-6">
            <ModeEditIcon className="h-4 w-4" />
          </CircleButton>
          <CircleButton info="Delete listboard" className="mr-1 h-6 w-6">
            <DeleteIcon className="h-4 w-4" />
          </CircleButton>
        </div>
      </div>
      <div className="flex h-full w-full flex-col px-2 py-1">
        <p className="text-xs text-neutral-300">description goes here...</p>
        <div className="mt-2 flex max-h-[150px] flex-col">
          <ListView className="items-start px-2">
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
            <li>todos....</li>
          </ListView>
        </div>
      </div>
    </div>
  );
}

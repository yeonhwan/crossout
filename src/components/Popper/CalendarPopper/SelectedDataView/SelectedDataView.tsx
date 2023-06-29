// Components
import TodosView from "./TodosVIew";
import DaylogView from "./DaylogView";
import RevenuesView from "./RevenuesView";

// icons
import LoadDetailIcon from "public/icons/load-detail.svg";

// types
import { type SelectedDateDateType } from "@/types/client";

type SelectedDataViewProps = {
  showDetail: boolean;
  closeShowDetail: () => void;
  currentData: SelectedDateDateType | undefined;
  field: "todo" | "daylog" | "revenue";
};

const SelectedDataView = ({
  showDetail,
  closeShowDetail,
  currentData,
  field,
}: SelectedDataViewProps) => {
  if (currentData) {
    return (
      <div className="flex h-full w-1/2">
        {field === "todo" && currentData.todos ? (
          <TodosView data={currentData} />
        ) : field === "daylog" && currentData.daylogs ? (
          <DaylogView data={currentData} />
        ) : field === "revenue" && currentData.revenues ? (
          <RevenuesView data={currentData} />
        ) : (
          ""
        )}
        {showDetail && (
          <span
            onClick={closeShowDetail}
            className="absolute bottom-4 right-[23%] flex h-8 w-8 animate-pulse items-center justify-center rounded-full hover:animate-none hover:cursor-pointer hover:bg-neutral-400/40 sm:right-0 sm:top-1/2"
          >
            <LoadDetailIcon className="h-4 w-4 fill-white" />
          </span>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default SelectedDataView;

import NoItemsIcon from "@/components/Graphic/Icons/NoItemsIcon";

const NoItems = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <NoItemsIcon className="h-32 w-32" color="white" />

      <p className="mt-2 text-lg font-semibold text-white">No Items</p>
    </div>
  );
};

export default NoItems;

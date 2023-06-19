import NoItemsIcon from "public/icons/no-items.svg";

const NoItems = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <NoItemsIcon className="h-32 w-32 stroke-white dark:stroke-neutral-700" />

      <p className="mt-2 text-lg font-semibold text-neutral-700 dark:text-white">
        Empty
      </p>
    </div>
  );
};

export default NoItems;

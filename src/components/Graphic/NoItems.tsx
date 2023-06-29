// icons
import NoItemsIcon from "public/icons/no-items.svg";

const NoItems = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <NoItemsIcon className="h-24 w-24 fill-neutral-700 dark:fill-white sm:h-32 sm:w-32" />

      <p className="mt-2 text-lg font-semibold text-neutral-700 dark:text-white">
        Empty
      </p>
    </div>
  );
};

export default NoItems;

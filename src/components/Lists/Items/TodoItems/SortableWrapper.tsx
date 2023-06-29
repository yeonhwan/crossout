// icons
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

// libs
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableWrapperProps = {
  children: JSX.Element;
  id: number;
  active?: boolean;
};

// sortable wrapper should wrap the todoItem components in order to make sorting work
const SortableWrapper = ({ children, id, active }: SortableWrapperProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (active) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex h-max w-full items-center justify-center"
      >
        {active && (
          <div
            {...listeners}
            className="flex items-center justify-center text-neutral-600 active:cursor-grabbing active:text-cyan-400 dark:text-white"
          >
            <DragIndicatorIcon />
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex h-max w-full items-center justify-center"
    >
      {children}
    </div>
  );
};

export default SortableWrapper;

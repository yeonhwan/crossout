// Props TYPE
type ListProps = {
  children?: JSX.Element;
};

export default function List({ children }: ListProps) {
  return (
    <div className="my-1.5 flex h-max min-h-[3.5rem] w-5/6 items-center rounded-full border-2 border-neutral-400 bg-neutral-600/70 shadow-lg drop-shadow-xl">
      {children}
    </div>
  );
}

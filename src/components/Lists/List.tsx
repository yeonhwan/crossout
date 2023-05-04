// Props TYPE
type ListProps = {
  children?: JSX.Element;
};

export default function List({ children }: ListProps) {
  return (
    <div className="my-1.5 flex h-14 w-5/6 items-center rounded-full border-2 border-neutral-400 bg-neutral-600/70 shadow-lg drop-shadow-xl">
      {children}
    </div>
  );
}

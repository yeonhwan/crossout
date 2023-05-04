// Props TYPE
type ButtonProps = {
  children?: string | JSX.Element;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  const onClickWrapper = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    } else {
      console.log("clicked");
    }
  };

  return (
    <button
      onClick={onClickWrapper}
      className="mx-2 max-h-12 px-2 py-2 shadow-lg hover:cursor-pointer hover:outline-2 hover:outline-emerald-400"
    >
      {children}
    </button>
  );
}

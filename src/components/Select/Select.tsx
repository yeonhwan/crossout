import React from "react";
import DownArrow from "public/icons/down_arrow.svg";
import { twMerge } from "tailwind-merge";

type SelectProps = {
  className?: string;
  children: JSX.Element;
  value: string | number | undefined;
  id?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const Select = ({ className, children, value, onChange, id }: SelectProps) => {
  const defaultClassName =
    "relative flex w-full h-8 rounded-md bg-neutral-600 hover:cursor-pointer";

  if (className) {
    className = twMerge(defaultClassName, className);
  } else {
    className = defaultClassName;
  }

  return (
    <div className={className}>
      <select
        id={id ? id : ""}
        className="h-full w-full bg-transparent hover:cursor-pointer"
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-0 top-0 flex h-full w-6 items-center justify-center">
        <DownArrow className="h-2 w-2 fill-inherit" />
      </span>
    </div>
  );
};

export default Select;

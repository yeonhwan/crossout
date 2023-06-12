// React, hooks
import { useContext } from "react";

// types
import { type Dispatch, type SetStateAction } from "react";

// libs
import { twMerge } from "tailwind-merge";

type ListboardSelectProps = {
  input: number | undefined;
  onChange: Dispatch<SetStateAction<number | undefined>>;
  className?: string;
};

import { HomeContext } from "@/pages";

const ListboardSelect = ({
  input,
  onChange,
  className,
}: ListboardSelectProps) => {
  const listboards = useContext(HomeContext);
  const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.currentTarget.value));
  };

  const defaultClassName = "rounded-lg py-1 text-center hover:cursor-pointer";
  if (className) {
    className = twMerge(defaultClassName, className);
  }

  return (
    <select
      className={className || defaultClassName}
      id="listboard"
      value={input}
      onChange={onChangeHandler}
    >
      <option value={undefined}>none</option>
      {listboards?.map((data) => {
        return (
          <option value={data.id} key={data.id}>
            {data.title}
          </option>
        );
      })}
    </select>
  );
};

export default ListboardSelect;

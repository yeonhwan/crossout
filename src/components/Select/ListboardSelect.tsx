// hooks
import { useContext } from "react";

// libs
import { twMerge } from "tailwind-merge";

// types
import type { Dispatch, SetStateAction } from "react";

type ListboardSelectProps = {
  input: number | undefined;
  onChange: Dispatch<SetStateAction<number | undefined>>;
  className?: string;
  data?: ListBoard[];
};

import { HomeContext } from "@/pages/myapp/home";
import { type ListBoard } from "@prisma/client";
import Select from "./Select";

const ListboardSelect = ({
  input,
  onChange,
  className,
  data,
}: ListboardSelectProps) => {
  const contextData = useContext(HomeContext);
  const listboards = data ? data : contextData;
  const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.currentTarget.value));
  };

  const defaultClassName =
    "rounded-lg py-1 flex text-center hover:cursor-pointer";
  if (className) {
    className = twMerge(defaultClassName, className);
  }

  return (
    <Select
      className={className || defaultClassName}
      id="listboard"
      value={input}
      onChange={onChangeHandler}
    >
      <>
        <option value={undefined}>none</option>
        {listboards?.map((data) => {
          return (
            <option value={data.id} key={data.id}>
              {data.title}
            </option>
          );
        })}
      </>
    </Select>
  );
};

export default ListboardSelect;

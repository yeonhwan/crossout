// React, hooks
import { useState } from "react";

// types
import { type Dispatch, type SetStateAction } from "react";
import { type ListBoard } from "@prisma/client";

// api
import { api } from "@/utils/api";

// libs
import { twMerge } from "tailwind-merge";

// styles
import loader_styles from "@/styles/loader.module.css";

type ListboardSelectProps = {
  input: number | undefined;
  onChange: Dispatch<SetStateAction<number | undefined>>;
  className?: string;
};

const ListboardSelect = ({
  input,
  onChange,
  className,
}: ListboardSelectProps) => {
  const [listboardData, setListboardData] = useState<ListBoard[] | null>(null);

  const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.currentTarget.value));
  };

  const { isLoading } = api.listboards.getListboards.useQuery(
    { data: { todos: false } },
    {
      onSuccess: (res) => {
        const { data } = res;
        setListboardData(data);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const defaultClassName = "rounded-lg py-1 text-center hover:cursor-pointer";
  if (className) {
    className = twMerge(defaultClassName, className);
  }

  if (isLoading) {
    return (
      <div className="my-2">
        <span className="flex h-full w-full items-center justify-center">
          <span className={`${loader_styles.loader as string}`} />
        </span>
      </div>
    );
  }

  return (
    <select
      className={className || defaultClassName}
      id="listboard"
      value={input}
      onChange={onChangeHandler}
    >
      <option value={undefined}>none</option>
      {listboardData?.map((data) => {
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

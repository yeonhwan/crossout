// components
import CircleButton from "@/components/Buttons/CircleButton";

// Icons
import ProfitIcon from "public/icons/profit.svg";
import LossIcon from "public/icons/loss.svg";
import TrashIcon from "public/icons/trash.svg";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

// utils
import { currencyFormatter } from "@/utils/currencyFormatter";

// React
import React, { useState } from "react";

// styles
import loader_styles from "@/styles/loader.module.css";

// stores
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

// api
import { api } from "@/utils/api";
import { type RevenueClient } from "@/types/client";

type RevenueItemProps = {
  data: RevenueClient;
};

const setRevenueDefault = (value: number) => {
  const isProfit = value >= 0 ? true : false;
  const absValue = Math.abs(value);
  return [isProfit, isProfit ? "+" : "-", currencyFormatter(absValue)];
};

const RevenueItem = ({ data }: RevenueItemProps) => {
  const { purpose, revenue, id } = data;
  const [isProfit, sign, money] = setRevenueDefault(revenue);
  const [isProceed, setIsProceed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [purposeInput, setPurposeInput] = useState(purpose);
  const [revenueInput, setRevenueInput] = useState(revenue.toString());
  const { setSnackbarOpen, setSnackbarData } = useSnackbarStore(
    (state) => state
  );

  const revenueInputRegEx = new RegExp(/^(\+|\-)?\d*\.?\d*$/);

  const utils = api.useContext();

  const { mutate: applyUpdate } = api.revenue.updateRevenue.useMutation({
    onSuccess: async (res) => {
      const { message, content } = res.data;
      await utils.revenue.getRevenues.invalidate();
      setIsUpdating(false);
      setIsProceed(false);
      setSnackbarOpen(true);
      setSnackbarData({ message, content, role: SnackbarRole.Success });
    },
    onError: (err) => {
      const { message } = err;
      setSnackbarOpen(true);
      setSnackbarData({ message, role: SnackbarRole.Error });
    },
  });

  const { mutate: deleteRevenue } = api.revenue.deleteRevenue.useMutation({
    onSuccess: async (res) => {
      const { message, content } = res.data;
      await utils.revenue.getRevenues.invalidate();
      setIsUpdating(false);
      setIsProceed(false);
      setSnackbarOpen(true);
      setSnackbarData({ message, content, role: SnackbarRole.Success });
    },
    onError: (err) => {
      const { message } = err;
      setSnackbarOpen(true);
      setSnackbarData({ message, role: SnackbarRole.Error });
    },
  });

  const applyUpdateClickHandler = () => {
    setIsProceed(true);
    applyUpdate({
      data: { id, revenue: Number(revenueInput), purpose: purposeInput },
    });
    return;
  };

  const cancelClickHandler = () => {
    setIsUpdating(false);
    setPurposeInput(purpose);
    setRevenueInput(revenue.toString());
  };

  const deleteClickHandler = () => {
    setIsProceed(true);
    deleteRevenue({ data: { id } });
  };

  if (isUpdating) {
    return (
      <div
        className={`relative m-2 flex h-max w-full items-center justify-between rounded-lg ${
          isProfit ? "bg-emerald-500 dark:bg-emerald-600" : "bg-red-400"
        } p-2 drop-shadow-lg`}
      >
        <div className="flex h-8 w-[15%] justify-between">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              isProfit ? "bg-emerald-400" : "bg-red-300"
            }`}
          >
            {isProfit ? (
              <ProfitIcon className="h-5 w-5 fill-emerald-800 pb-1" />
            ) : (
              <LossIcon className="h-5 w-5 fill-red-800 pt-1" />
            )}
          </div>
          {isProceed && (
            <span className="flex h-8 w-8 items-center justify-center">
              <span className={`${loader_styles.loader as string}`} />
            </span>
          )}
        </div>
        <div className="flex h-14 w-1/2 flex-col items-center justify-between text-white">
          <div
            className={`flex h-[45%] w-full justify-center rounded-md focus-within:outline-none focus-within:outline-2 focus-within:outline-cyan-300 ${
              isProfit ? "bg-emerald-400" : "bg-red-300"
            }`}
          >
            <input
              value={purposeInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPurposeInput(e.currentTarget.value);
              }}
              className="w-full rounded-md border-none bg-transparent text-center outline-none"
            />
          </div>
          <div
            className={`flex h-[45%] w-full justify-center rounded-md focus-within:outline-none focus-within:outline-2 focus-within:outline-cyan-300 ${
              isProfit ? "bg-emerald-400" : "bg-red-300"
            }`}
          >
            <span className="ml-2">$</span>
            <input
              className="w-full rounded-md border-none bg-transparent text-center outline-none"
              placeholder="0"
              value={revenueInput.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!revenueInputRegEx.test(e.currentTarget.value)) {
                  window.alert("Wrong Value");
                } else {
                  setRevenueInput(e.currentTarget.value);
                }
              }}
            />
          </div>
        </div>
        <div className="flex w-[15%] min-w-max items-center justify-between px-2">
          <CircleButton
            info="Apply"
            className="flex h-7 w-7 rounded-lg bg-neutral-600/50 dark:bg-neutral-800/50"
            onClick={applyUpdateClickHandler}
          >
            <CheckIcon className="h-3 w-3" />
          </CircleButton>
          <CircleButton
            info="Cancel"
            className="flex h-7 w-7 rounded-lg bg-neutral-600/50 dark:bg-neutral-800/50"
            onClick={cancelClickHandler}
          >
            <CloseIcon className="h-3 w-3" fill="white" />
          </CircleButton>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative m-2 flex h-16 w-full justify-center rounded-lg ${
        isProfit ? "bg-emerald-500 dark:bg-emerald-600" : "bg-red-400"
      } p-2 drop-shadow-lg`}
    >
      <div
        className={`absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full ${
          isProfit ? "bg-emerald-400" : "bg-red-300"
        }`}
      >
        {isProfit ? (
          <ProfitIcon className="h-5 w-5 fill-emerald-800 pb-1" />
        ) : (
          <LossIcon className="h-5 w-5 fill-red-800 pt-1" />
        )}
      </div>
      <div className="flex flex-col items-center text-white">
        <p className="font-semibold">{purpose}</p>
        <p className="font-smibold text-sm">
          <span>{sign}</span>
          {money}
        </p>
      </div>
      <div className="absolute right-4 top-4 flex w-[11%] min-w-max max-w-[60px] items-center justify-between">
        <CircleButton
          info="Edit"
          className="flex h-7 w-7 rounded-lg bg-neutral-600/50 dark:bg-neutral-800/50"
          onClick={() => {
            setIsUpdating(true);
          }}
        >
          <ModeEditOutlineIcon className="h-3 w-3" />
        </CircleButton>
        <CircleButton
          info="Delete"
          className="flex h-7 w-7 rounded-lg bg-neutral-600/50 dark:bg-neutral-800/50"
          onClick={() => {
            if (window.confirm("deleting revenue")) {
              deleteClickHandler();
            }
          }}
        >
          <TrashIcon className="h-3 w-3" fill="white" />
        </CircleButton>
      </div>
    </div>
  );
};

export default RevenueItem;

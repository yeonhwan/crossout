// components
import CircleButton from "@/components/Buttons/CircleButton";

// Icons
import ProfitIcon from "public/icons/profit.svg";
import LossIcon from "public/icons/loss.svg";
import TrashIcon from "public/icons/trash.svg";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LoaderIcon from "public/icons/spinner.svg";

// libs
import ClickAwayListener from "@mui/base/ClickAwayListener";

// utils
import { currencyFormatter } from "@/utils/currencyFormatter";

// React
import React, { useState, useRef } from "react";

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
  const { setSnackbarOpen, setSnackbarData, setSnackbarLoadingState } =
    useSnackbarStore((state) => state);
  const currentRevenue = {
    data: {
      id: data.id,
      purpose: data.purpose,
      revenue: data.revenue,
    },
  };
  const previousData = useRef(currentRevenue);

  const revenueInputRegEx = new RegExp(/^(\+|\-)?\d*\.?\d*$/);

  const utils = api.useContext();

  const { mutate: abortUpdateRevenue } = api.revenue.updateRevenue.useMutation({
    onSuccess: async (res) => {
      const { revenue } = res.data;
      await utils.revenue.getRevenues.invalidate();
      setSnackbarLoadingState(false);
      setSnackbarOpen(true);
      const currentRevenue = {
        data: {
          id: revenue.id,
          purpose: revenue.purpose,
          revenue: Number(revenue.revenue),
        },
      };
      previousData.current = currentRevenue;
      setSnackbarData({
        message: "Canceld update revenue",
        role: SnackbarRole.Success,
      });
    },
    onError: () => {
      setSnackbarLoadingState(false);
      setSnackbarOpen(true);
      setSnackbarData({
        message: "Request failed. Please try again or report the issue.",
        role: SnackbarRole.Error,
      });
    },
  });

  const { mutate: applyUpdate } = api.revenue.updateRevenue.useMutation({
    onSuccess: async (res) => {
      const { content, revenue } = res.data;
      await utils.revenue.getRevenues.invalidate();
      setIsUpdating(false);
      setIsProceed(false);
      setSnackbarOpen(true);
      setSnackbarData({
        message: "Updated revenue",
        content,
        role: SnackbarRole.Success,
        previousData: previousData.current,
        handler: (data) => {
          setSnackbarLoadingState(true);
          abortUpdateRevenue(
            data as {
              data: {
                id: number;
                revenue: number;
                purpose: string;
              };
            }
          );
        },
      });
      const currentRevenue = {
        data: {
          id: revenue.id,
          purpose: revenue.purpose,
          revenue: Number(revenue.revenue),
        },
      };
      previousData.current = currentRevenue;
    },
    onError: (err) => {
      const { message } = err;
      setSnackbarOpen(true);
      setSnackbarData({ message, role: SnackbarRole.Error });
    },
  });

  const { mutate: deleteRevenue } = api.revenue.deleteRevenue.useMutation({
    onSuccess: async (res) => {
      const { content } = res.data;
      await utils.revenue.getRevenues.invalidate();
      setIsUpdating(false);
      setIsProceed(false);
      setSnackbarOpen(true);
      setSnackbarData({
        message: "Deleted Revenue",
        content,
        role: SnackbarRole.Success,
      });
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

  const contentRender = () => {
    // Item Render (updating)
    if (isUpdating) {
      return (
        <ClickAwayListener
          onClickAway={() => {
            setIsUpdating(false);
          }}
        >
          <div
            className={`relative flex h-full w-full items-center justify-between rounded-lg drop-shadow-lg`}
          >
            <div className="flex h-full w-[10%] items-center justify-center sm:w-[10%]">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full sm:h-8 sm:w-8 ${
                  isProfit ? "bg-emerald-400" : "bg-red-300"
                }`}
              >
                {isProfit ? (
                  <ProfitIcon className="h-4 w-4 fill-emerald-800 pb-1 sm:h-5 sm:w-5" />
                ) : (
                  <LossIcon className="h-4 w-4 fill-red-800 pt-1 sm:h-5 sm:w-5" />
                )}
              </div>
            </div>
            <div className="flex h-full w-[60%] flex-col items-center justify-evenly text-white">
              <div className="flex h-[40%] max-h-[30px] min-h-[25px] w-full justify-center rounded-md bg-neutral-400/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-300">
                <input
                  value={purposeInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPurposeInput(e.currentTarget.value);
                  }}
                  className="w-full rounded-md border-none bg-transparent pl-4 text-center text-xs outline-none sm:text-base"
                  autoFocus
                />
              </div>
              <span
                className={`my-1 w-full pl-4 text-center text-[8px] sm:my-1 ${
                  purposeInput.length > 45 || purposeInput.length <= 0
                    ? "text-red-400"
                    : ""
                }`}
              >{`${purposeInput.length} / 45`}</span>
              <div className="flex h-[40%] max-h-[30px] min-h-[25px] w-full justify-center rounded-md bg-neutral-400/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-300">
                <span className="ml-2 sm:pt-1">$</span>
                <input
                  className="w-full rounded-md border-none bg-transparent text-center text-xs outline-none sm:text-sm"
                  placeholder="0"
                  value={revenueInput.toString()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setRevenueInput(e.currentTarget.value);
                  }}
                />
              </div>
            </div>
            <div className="flex h-full w-[18%] max-w-[50px] items-center justify-evenly sm:w-[10%] sm:max-w-[70px]">
              {isProceed ? (
                <LoaderIcon className="h-8 w-8 fill-white" />
              ) : (
                <>
                  <CircleButton
                    info="Apply"
                    className={`flex h-5 w-5 rounded-md bg-emerald-400 transition-none hover:bg-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-400 sm:h-6 sm:w-6 ${
                      purposeInput.length <= 0 ||
                      purposeInput.length > 45 ||
                      !revenueInputRegEx.test(revenueInput)
                        ? "pointer-events-none bg-neutral-400 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-800"
                        : ""
                    }`}
                    onClick={applyUpdateClickHandler}
                  >
                    <CheckIcon
                      className={`h-3 w-3 transition-none sm:h-4 sm:w-4 ${
                        purposeInput.length <= 0 ||
                        purposeInput.length > 45 ||
                        !revenueInputRegEx.test(revenueInput)
                          ? "fill-white"
                          : ""
                      }`}
                    />
                  </CircleButton>
                  <CircleButton
                    info="Cancel"
                    className="flex h-5 w-5 rounded-md bg-red-300 hover:bg-red-400 dark:bg-red-400 dark:hover:bg-red-500 sm:h-6 sm:w-6"
                    onClick={cancelClickHandler}
                  >
                    <CloseIcon className="h-3 w-3 sm:h-4 sm:w-4" fill="white" />
                  </CircleButton>
                </>
              )}
            </div>
          </div>
        </ClickAwayListener>
      );
    }

    // Item Render (not updating)
    return (
      <div
        className={`relative mb-1 flex h-full w-full items-center justify-between rounded-lg drop-shadow-lg sm:m-2`}
      >
        <div className="flex h-full w-[18%] max-w-[50px] items-center justify-center sm:w-[20%]">
          <span
            className={`flex h-max w-max rounded-full p-1 sm:p-2 ${
              isProfit ? "bg-emerald-400" : "bg-red-300"
            }`}
          >
            {isProfit ? (
              <ProfitIcon className="h-4 w-4 fill-emerald-800 pb-1 sm:h-5 sm:w-5" />
            ) : (
              <LossIcon className="h-4 w-4 fill-red-800 pt-1 sm:h-5 sm:w-5" />
            )}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-white">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold sm:text-base">
            {purpose}
          </p>
          <p className="font-smibold overflow-hidden text-ellipsis whitespace-nowrap text-[8px] sm:text-sm">
            <span>{sign}</span>
            {money}
          </p>
        </div>
        <div className="flex h-full w-[17%] max-w-[50px] items-center justify-evenly sm:w-[10%] sm:max-w-[70px]">
          {isProceed ? (
            <LoaderIcon className="h-8 w-8 fill-white" />
          ) : (
            <>
              <CircleButton
                info="Edit"
                className="flex h-5 w-5 rounded-md bg-orange-300 hover:bg-orange-400 dark:bg-orange-300 dark:hover:bg-orange-400 sm:h-6 sm:w-6"
                onClick={() => {
                  setIsUpdating(true);
                }}
              >
                <ModeEditOutlineIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </CircleButton>
              <CircleButton
                info="Delete"
                className="dark:hover-bg-red-500 flex h-5 w-5 rounded-md bg-red-300 p-0 hover:bg-red-500 dark:bg-red-300 sm:h-6 sm:w-6"
                onClick={() => {
                  if (window.confirm("deleting revenue")) {
                    deleteClickHandler();
                  }
                }}
              >
                <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" fill="white" />
              </CircleButton>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <li
      className={`relative my-1 flex w-full items-center justify-between rounded-lg px-2 py-2 drop-shadow-lg transition-all sm:my-1.5 sm:p-2 ${
        isProfit ? "bg-emerald-500 dark:bg-emerald-600" : "bg-red-400"
      } ${isUpdating ? "h-20 sm:h-28" : "h-12 sm:h-16"}`}
    >
      {contentRender()}
    </li>
  );
};

export default RevenueItem;

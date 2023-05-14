import { create } from "zustand";
import dayjs from "dayjs";

type DateState = {
  dateObj: {
    now: dayjs.Dayjs;
    get year(): number;
    get month(): string;
    get date(): number;
    get day(): string;
  };
};

type DateAction = {
  increaseDate: () => void;
  decreaseDate: () => void;
};

const useDateStore = create<DateState & DateAction>()((set) => ({
  dateObj: {
    now: dayjs(),
    get year(): number {
      return this.now.get("year");
    },

    get month(): string {
      return this.now.format("MMM");
    },

    get date(): number {
      return this.now.get("date");
    },

    get day(): string {
      return this.now.format("ddd");
    },
  },
  increaseDate: () =>
    set((state: DateState) => ({
      dateObj: {
        now: state.dateObj.now.add(1, "day"),
        get year(): number {
          return this.now.get("year");
        },

        get month(): string {
          return this.now.format("MMM");
        },

        get date(): number {
          return this.now.get("date");
        },

        get day(): string {
          return this.now.format("ddd");
        },
      },
    })),

  decreaseDate: () =>
    set((state: DateState) => ({
      dateObj: {
        now: state.dateObj.now.subtract(1, "day"),
        get year(): number {
          return this.now.get("year");
        },

        get month(): string {
          return this.now.format("MMM");
        },

        get date(): number {
          return this.now.get("date");
        },

        get day(): string {
          return this.now.format("ddd");
        },
      },
    })),
}));

export default useDateStore;

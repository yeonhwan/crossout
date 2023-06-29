export const dateIndexFormatter = (
  year: number,
  month: number,
  date: number
) => {
  const twoDigitFiller = (number: number) => {
    if (number < 10) {
      return `0${number}`;
    } else {
      return `${number}`;
    }
  };

  return Number(String(year) + twoDigitFiller(month) + twoDigitFiller(date));
};

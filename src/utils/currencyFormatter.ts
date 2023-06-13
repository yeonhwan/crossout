export const currencyFormatter = (value: number) => {
  const formatter = new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  });

  const currencyWithDecimal = formatter.format(value);
  const currencySplitArr = currencyWithDecimal.split(".");
  const decimals = currencySplitArr[1] as string;
  const noDecimals = currencySplitArr[0] as string;
  const emptyDecimalRegEx = new RegExp(/^[0]*$/, "gi");
  if (decimals && emptyDecimalRegEx.test(decimals)) {
    return noDecimals;
  } else {
    return currencyWithDecimal;
  }
};

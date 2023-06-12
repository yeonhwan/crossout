import { useEffect, useState } from "react";

export const useWindowSize = (defaultState: boolean) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    window.onresize = (_) => {
      const isVertical =
        window.innerHeight / window.innerWidth >= 1 || window.innerWidth <= 700;

      if (isVertical) setState(true);
      else if (!isVertical) setState(false);
      else return;
    };
  });

  return state;
};

import { useEffect, useState } from "react";

export const useWinodwVertical = (defaultState: boolean) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const initialBrowserState =
      window.innerHeight / window.innerWidth >= 1 || window.innerWidth <= 700;

    setState(initialBrowserState ? true : false);

    window.addEventListener("resize", (_) => {
      const isVertical =
        window.innerHeight / window.innerWidth >= 1 || window.innerWidth <= 700;
      if (isVertical) setState(true);
      else if (!isVertical) setState(false);
      else return;
    });
  }, []);

  return state;
};

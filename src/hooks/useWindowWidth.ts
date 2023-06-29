import { useEffect, useState } from "react";

export const useWindowWidth = (defaultState: boolean, max: number) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const initialBrowserState = window.innerWidth >= max;
    setState(initialBrowserState);
    window.addEventListener("resize", (_) => {
      const isMax = window.innerWidth >= max;

      if (isMax) setState(true);
      else if (!isMax) setState(false);
      else return;
    });
  }, []);

  return state;
};

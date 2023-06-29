// hooks
import { useState, useEffect } from "react";

type ReturnTypes = [boolean, boolean, () => void];

export function useAnimation(isMounted: boolean) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (isMounted) {
      setCompleted(true);
    }
  }, [isMounted]);

  const shouldRender = isMounted || completed;
  const animateTrigger = isMounted && completed;

  const handleTransition = () => {
    if (!isMounted) {
      setCompleted(false);
    }
  };

  return [shouldRender, animateTrigger, handleTransition] as ReturnTypes;
}

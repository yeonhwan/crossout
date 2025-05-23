// hooks
import { useAnimation } from "@/hooks/useAnimation";

// libs
import ClickAwayListener from "@mui/material/ClickAwayListener";

type DialogProps = {
  children: React.ReactElement;
  onClickAway: () => void;
  openState: boolean;
};

// useAnimation is used for simple mount/unmount animation
// Framer-Motion can substitute this functionality

const Dialog = ({ children, onClickAway, openState }: DialogProps) => {
  const [shouldRender, animateTrigger, handleTransition] =
    useAnimation(openState);

  if (shouldRender) {
    return (
      <dialog
        open={shouldRender}
        className={`absolute left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-neutral-500/20 backdrop-blur-lg dark:bg-black/30 ${
          animateTrigger ? "opacity-1" : "opacity-0"
        } transition-opacity`}
        onTransitionEnd={handleTransition}
      >
        <ClickAwayListener onClickAway={onClickAway}>
          {children}
        </ClickAwayListener>
      </dialog>
    );
  } else {
    return null;
  }
};

export default Dialog;

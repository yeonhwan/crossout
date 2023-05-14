// React
import { type ForwardedRef } from "react";

// libs
import Snackbar from "@mui/material/Snackbar";
import Slide, { type SlideProps } from "@mui/material/Slide";

// types
import { type SnackbarData } from "@/stores/useSnackbarStore";

// stores
import useSnackbarStore from "@/stores/useSnackbarStore";

// components
import SnackbarSuccess from "@/components/Snackbar/SnackbarSuccess";
import SnackbarError from "@/components/Snackbar/SnackbarError";
import { SnackbarRole } from "../../stores/useSnackbarStore";

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

type TransitionProps = Omit<SlideProps, "direction">;

export type SnackbarContentProps = {
  data: SnackbarData;
  ref: ForwardedRef<HTMLDivElement>;
  setOpen: (openState: boolean) => void;
};

const SnackbarComponent = () => {
  const { open, setSnackbarOpen, snackbarData } = useSnackbarStore(
    (state) => state
  );

  switch (snackbarData?.role) {
    case SnackbarRole.Success:
      return (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={open}
          autoHideDuration={4000}
          onClose={() => {
            setSnackbarOpen(false);
          }}
          TransitionComponent={TransitionUp}
        >
          {/* MUI Snackbar Components needs real html tag not Component to hold a ref of children */}
          <div>
            <SnackbarSuccess data={snackbarData} setOpen={setSnackbarOpen} />
          </div>
        </Snackbar>
      );

    case SnackbarRole.Error:
      return (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={open}
          autoHideDuration={4000}
          onClose={() => {
            setSnackbarOpen(false);
          }}
          TransitionComponent={TransitionUp}
        >
          {/* MUI Snackbar Components needs real html tag not Component to hold a ref of children */}
          <div>
            <SnackbarError data={snackbarData} setOpen={setSnackbarOpen} />
          </div>
        </Snackbar>
      );

    case SnackbarRole.Info:
      return (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={open}
          autoHideDuration={4000}
          onClose={() => {
            setSnackbarOpen(false);
          }}
          TransitionComponent={TransitionUp}
        >
          <p className="flex h-12 min-h-max w-80 min-w-max items-center justify-center rounded-lg bg-white p-4">
            snackbar
          </p>
        </Snackbar>
      );

    default:
      return null;
  }
};

export default SnackbarComponent;

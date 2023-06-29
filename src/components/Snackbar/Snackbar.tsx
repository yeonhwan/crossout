// components
import SnackbarContent from "@/components/Snackbar/SnackbarContent";

// hooks
import { useWindowWidth } from "@/hooks/useWindowWidth";

// libs
import Snackbar from "@mui/material/Snackbar";
import Slide, { type SlideProps } from "@mui/material/Slide";

// stores
import useSnackbarStore from "@/stores/useSnackbarStore";

type TransitionProps = Omit<SlideProps, "direction">;

// Snackbar animation component
function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const SnackbarComponent = () => {
  const { open, setSnackbarOpen, snackbarData, loading } = useSnackbarStore(
    (state) => state
  );
  const isDesktop = useWindowWidth(false, 640);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: isDesktop ? "right" : "center",
      }}
      open={open}
      autoHideDuration={4000}
      onClose={() => {
        setSnackbarOpen(false);
      }}
      TransitionComponent={TransitionUp}
    >
      {/* MUI Snackbar Components needs real html tag not Component to hold a ref of children */}
      <div>
        {snackbarData && (
          <SnackbarContent
            data={snackbarData}
            setOpen={setSnackbarOpen}
            loading={loading}
          />
        )}
      </div>
    </Snackbar>
  );
};

export default SnackbarComponent;

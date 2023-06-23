import { type AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "@/utils/api";
import "@/styles/globals.scss";
import { type NextPage } from "next";
import { StyledEngineProvider } from "@mui/material/styles";
import { Router } from "next/router";
import NProgress from "nprogress";

// components
import SnackbarComponent from "@/components/Snackbar/Snackbar";

// devtools
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
  pageProps: object;
};

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout;

  if (getLayout) {
    return (
      <StyledEngineProvider injectFirst>
        <ReactQueryDevtools initialIsOpen={false} />
        <SessionProvider session={session}>
          {getLayout(
            <Component {...pageProps}>{<SnackbarComponent />}</Component>
          )}
        </SessionProvider>
      </StyledEngineProvider>
    );
  }

  return (
    <StyledEngineProvider injectFirst>
      <ReactQueryDevtools initialIsOpen={false} />
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <SnackbarComponent />
      </SessionProvider>
    </StyledEngineProvider>
  );
};

export default api.withTRPC(MyApp);

/* when _app crashes on pageProps or Session errors try below
  chnage MyApp type with:
  const MyApp: AppType<{session: Session | ull}>

  delete AppPropsWithLayout

  change Component.getLayout as:
  (Componenet as NextPageWithLayout).getLayout
*/

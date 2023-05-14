import { type AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/Layout";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { type NextPage } from "next";
import { StyledEngineProvider } from "@mui/material/styles";

// components
import SnackbarComponent from "@/components/Snackbar/Snackbar";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
  pageProps: object;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout;

  if (getLayout) {
    return (
      <StyledEngineProvider injectFirst>
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
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps}>{<SnackbarComponent />}</Component>
          <SnackbarComponent />
        </Layout>
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

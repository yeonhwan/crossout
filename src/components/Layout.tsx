// Components
import Header from "@/components/Header/Header";

// types
import { type UserDataState } from "@/types/client";

// Libs
import Lottie from "lottie-react";

// bg
import NatureLight from "public/lottie/nature_light.json";
import NatureDark from "public/lottie/nature_night.json";
import NatureLightVert from "public/lottie/nature_light_vert.json";
import NatureDarkVert from "public/lottie/nature_night_vert.json";

// Hooks
import { useWinodwVertical } from "@/hooks/useWindowVertical";

type LayoutProps = {
  children: React.ReactElement | React.ReactElement[];
  userData: UserDataState;
};

const Layout = ({ children, userData }: LayoutProps) => {
  const isVertical = useWinodwVertical(false);
  const { preference, username } = userData;
  const { isLight, background } = preference;

  if (background === "2") {
    return (
      <div className={`${isLight ? "" : "dark"} layout flex h-full w-full`}>
        <div className="simple flex h-full w-full flex-col overflow-hidden transition-all">
          <Header username={username} />
          {children}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`${
          isLight ? "" : "dark"
        } layout relative flex h-full w-full`}
      >
        <div className="flex h-full w-full flex-col overflow-hidden">
          <span className="absolute left-0 top-0 z-[-1] flex min-h-full min-w-full justify-center overflow-hidden">
            {isVertical ? (
              isLight ? (
                <Lottie
                  className="background vertical"
                  animationData={NatureLightVert as unknown}
                  rendererSettings={{
                    preserveAspectRatio: "none",
                  }}
                />
              ) : (
                <Lottie
                  className="background vertical"
                  animationData={NatureDarkVert as unknown}
                  rendererSettings={{
                    preserveAspectRatio: "none",
                  }}
                />
              )
            ) : isLight ? (
              <Lottie
                className="background absolute h-full w-full"
                animationData={NatureLight}
                rendererSettings={{
                  preserveAspectRatio: "none",
                }}
              />
            ) : (
              <Lottie
                className="background absolute h-full w-full"
                animationData={NatureDark}
                rendererSettings={{
                  preserveAspectRatio: "none",
                }}
              />
            )}
          </span>
          <Header username={username} />
          {children}
        </div>
      </div>
    );
  }
};

export default Layout;

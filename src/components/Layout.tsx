// components
import Header from "@/components/Header/Header";

// hooks
import { useWinodwVertical } from "@/hooks/useWindowVertical";

// libs
import Lottie from "lottie-react";

// backgrounds
import NatureLight from "public/lottie/nature_light.json";
import NatureDark from "public/lottie/nature_night.json";
import NatureLightVert from "public/lottie/nature_light_vert.json";
import NatureDarkVert from "public/lottie/nature_night_vert.json";

// types
import { type UserDataState } from "@/types/client";

type LayoutProps = {
  children: React.ReactElement | React.ReactElement[];
  userData: UserDataState;
};

const Layout = ({ children, userData }: LayoutProps) => {
  const isVertical = useWinodwVertical(false);
  const { preference, username } = userData;
  const { isLight, background } = preference;

  return (
    <div
      className={`${isLight ? "" : "dark"} layout relative flex h-full w-full`}
    >
      <div className="flex h-full w-full flex-col items-center overflow-hidden">
        {background === "2" && (
          <div className="simple absolute left-0 top-0 z-[-1] flex h-full w-full transition-all" />
        )}
        {background === "1" && (
          <div className="absolute left-0 top-0 z-[-1] flex min-h-full min-w-full justify-center overflow-hidden">
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
          </div>
        )}

        <Header username={username} />
        {children}
      </div>
    </div>
  );
};

export default Layout;

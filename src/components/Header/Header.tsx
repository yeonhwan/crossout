// Components
import Sidebar from "@/components/Sidebar/Sidebar";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import LogoSimple from "public/logo/logo_simple.svg";

// hooks
import { useState } from "react";
import { useAnimation } from "@/hooks/useAnimation";

import { useRouter } from "next/navigation";

type HeaderProps = {
  username: string;
};

const Header = ({ username }: HeaderProps) => {
  const [navOpen, setNavOpen] = useState(false);
  const [shouldRender, animateTrigger, handleAnimation] = useAnimation(navOpen);
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 flex h-[10%] w-full items-center justify-between px-4 py-2 sm:px-8">
      <LogoSimple
        onClick={() => {
          router.push("/myapp/home");
        }}
        className="h-6 w-6 fill-none stroke-teal-400 transition-colors hover:cursor-pointer hover:stroke-teal-600 dark:hover:stroke-teal-200 mobile:h-8 mobile:w-8"
      />
      <span
        onClick={() => {
          setNavOpen(true);
        }}
        className="flex h-10 w-10 items-center justify-center rounded-full p-2 transition-colors hover:animate-pulse hover:cursor-pointer hover:bg-neutral-300/50 dark:hover:bg-neutral-500/50"
      >
        <MenuIcon className="h-6 w-6 fill-neutral-500 dark:fill-white" />
      </span>
      {shouldRender && (
        <Sidebar
          username={username}
          animateTrigger={animateTrigger}
          handleAnimation={handleAnimation}
          setNavOpen={setNavOpen}
        />
      )}
    </div>
  );
};

export default Header;

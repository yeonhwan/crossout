// Components
import Sidebar from "@/components/Sidebar/Sidebar";
import MenuToggle from "@/components/Header/MenuToggle";

// Icons
import LogoSimple from "public/logo/logo_simple.svg";

// hooks
import { useState } from "react";
import { useAnimation } from "@/hooks/useAnimation";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type HeaderProps = {
  username: string;
};

const Header = ({ username }: HeaderProps) => {
  const [navOpen, setNavOpen] = useState(false);
  const [shouldRender, animateTrigger, handleAnimation] = useAnimation(navOpen);
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 flex h-[10%] w-full items-center justify-between px-8 py-2 sm:px-12">
      <LogoSimple
        onClick={() => {
          router.push("/myapp/home");
        }}
        className="h-6 w-6 fill-none stroke-teal-400 transition-colors hover:cursor-pointer hover:stroke-teal-600 dark:hover:stroke-teal-200 mobile:h-8 mobile:w-8"
      />
      <motion.span
        onClick={() => {
          setNavOpen(true);
        }}
        animate={navOpen ? "open" : "closed"}
        transition={{ duration: 0.1 }}
        className="z-[60] flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:animate-pulse hover:cursor-pointer hover:bg-neutral-300/50 dark:hover:bg-neutral-500/50 sm:h-9 sm:w-9"
      >
        <MenuToggle className="translate-x-[24%] translate-y-1/4 stroke-neutral-500 dark:stroke-white" />
      </motion.span>
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

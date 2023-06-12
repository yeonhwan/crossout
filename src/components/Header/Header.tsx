// Next
import Image from "next/image";

// Components
import Sidebar from "@/components/Sidebar/Sidebar";

// hooks
import { useState } from "react";
import { useAnimation } from "@/hooks/useAnimation";

type HeaderProps = {
  username: string;
};

const Header = ({ username }: HeaderProps) => {
  const [navOpen, setNavOpen] = useState(false);
  const [shouldRender, animateTrigger, handleAnimation] = useAnimation(navOpen);

  return (
    <div className="sticky top-0 z-50 flex h-[15%] w-full justify-end px-8 py-4">
      <Image
        src="/images/dummyProfile.jpg"
        className="h-14 w-14 rounded-full hover:cursor-pointer"
        alt="profile"
        width={50}
        height={50}
        tabIndex={0}
        onClick={() => {
          setNavOpen(true);
        }}
        onBlur={() => {
          setNavOpen(false);
        }}
      />
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

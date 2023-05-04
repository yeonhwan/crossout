// Next
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// styles
import loader_styles from "@/styles/loader.module.css";

// Components
import Sidebar from "../Sidebar/Sidebar";

// hooks
import { useState } from "react";
import { useAnimation } from "@/hooks/useAnimation";

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [shouldRender, animateTrigger, handleAnimation] = useAnimation(navOpen);

  if (status === "authenticated") {
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
            userId={session.user.id}
            animateTrigger={animateTrigger}
            handleAnimation={handleAnimation}
            setNavOpen={setNavOpen}
          />
        )}
      </div>
    );
  } else if (status === "unauthenticated") {
    return (
      <div className="sticky top-0 flex h-[15%] w-full justify-end px-8 py-4">
        <button
          onClick={() => {
            router.push("/signin");
          }}
          className="rounded-xl p-2"
        >
          Sgin in
        </button>
      </div>
    );
  } else {
    return (
      <div className="sticky top-0 flex h-20 w-full justify-end px-8 py-4">
        <span className="flex items-center justify-center">
          <span
            className={`ml-2 border-amber-200 ${
              loader_styles.loader as string
            }`}
          />
        </span>
      </div>
    );
  }
};

export default Header;

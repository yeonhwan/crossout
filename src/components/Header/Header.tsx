import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import loader_styles from "@/styles/loader.module.css";
import Sidebar from "../Sidebar/Sidebar";
import { useState } from "react";
import { useAnimation } from "@/hooks/useAnimation";

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [shouldRender, animateTrigger, handleAnimation] = useAnimation(navOpen);

  if (status === "authenticated") {
    return (
      <div
        tabIndex={0}
        onClick={() => {
          setNavOpen(true);
        }}
        className="sticky top-0 flex h-20 w-full justify-end px-8 py-4 hover:cursor-pointer"
        onBlur={() => {
          setNavOpen(false);
        }}
      >
        <Image
          src="/images/dummyProfile.jpg"
          className="rounded-full"
          alt="profile"
          width={50}
          height={50}
        />
        {shouldRender && (
          <Sidebar
            animateTrigger={animateTrigger}
            handleAnimation={handleAnimation}
          />
        )}
      </div>
    );
  } else if (status === "unauthenticated") {
    return (
      <div className="sticky top-0 flex h-20 w-full justify-end px-8 py-4">
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

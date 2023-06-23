// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";

// Next
import { useRouter, usePathname } from "next/navigation";

// Next Auth
import { signOut } from "next-auth/react";

import { ClickAwayListener } from "@mui/material";

type SidebarProps = {
  animateTrigger: boolean;
  handleAnimation: () => void;
  username: string;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({
  animateTrigger,
  handleAnimation,
  username,
  setNavOpen,
}: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <ClickAwayListener
      onClickAway={() => {
        setNavOpen(false);
      }}
    >
      <aside
        onTransitionEnd={handleAnimation}
        className={`${
          animateTrigger ? "opacity-100" : "translate-x-40 opacity-0"
        } absolute right-0 top-0 flex h-screen w-48 flex-col bg-neutral-400/50 pt-10 backdrop-blur-md transition-all ease-in-out will-change-transform dark:bg-neutral-800/50 lg:w-56`}
      >
        <p className="mb-4 ml-2 mt-10 flex w-full flex-col items-center dark:text-white">
          Welcome back,{" "}
          <span className="font-bold text-teal-600 dark:text-teal-400">
            {username}
          </span>
        </p>
        <ul>
          <li
            onClick={() => {
              router.push("/myapp/home");
              setNavOpen(false);
            }}
            className={`flex w-full px-8 py-4 text-xs font-semibold text-white hover:cursor-pointer hover:bg-teal-400 hover:text-white lg:text-base ${
              pathname.includes("home")
                ? "pointer-events-none bg-teal-500 dark:bg-teal-600"
                : ""
            }`}
          >
            <HomeIcon className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
            Home
          </li>
          <li
            onClick={() => {
              router.push("/myapp/listboards");
              setNavOpen(false);
            }}
            className={`flex w-full px-8 py-4 text-xs font-semibold text-white hover:cursor-pointer hover:bg-teal-400 hover:text-white lg:text-base ${
              pathname.includes("listboards")
                ? "pointer-events-none bg-teal-500 dark:bg-teal-600"
                : ""
            }`}
          >
            <DashboardIcon className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
            Listboards
          </li>
          <li
            onClick={() => {
              router.push("/myapp/mystats");
              setNavOpen(false);
            }}
            className={`flex w-full px-8 py-4 text-xs font-semibold text-white hover:cursor-pointer hover:bg-teal-400 hover:text-white lg:text-base ${
              pathname.includes("mystats")
                ? "pointer-events-none bg-teal-500 dark:bg-teal-600"
                : ""
            }`}
          >
            <ShowChartIcon className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
            My Stats
          </li>
          <li
            onClick={() => {
              router.push("/myapp/preference");
              setNavOpen(false);
            }}
            className={`flex w-full px-8 py-4 text-xs font-semibold text-white hover:cursor-pointer hover:bg-teal-400 hover:text-white lg:text-base ${
              pathname.includes("preference")
                ? "pointer-events-none bg-teal-500 dark:bg-teal-600"
                : ""
            }`}
          >
            <SettingsIcon className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
            Preference
          </li>
          <li
            className="flex w-full px-8 py-4 text-xs font-semibold text-white hover:cursor-pointer hover:bg-teal-400 hover:text-white lg:text-base"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <ExitToAppIcon className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
            Sign Out
          </li>
        </ul>
      </aside>
    </ClickAwayListener>
  );
};

export default Sidebar;

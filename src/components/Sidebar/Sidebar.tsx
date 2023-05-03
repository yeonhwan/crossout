import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type SidebarProps = {
  animateTrigger: boolean;
  handleAnimation: () => void;
  userId: string;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({
  animateTrigger,
  handleAnimation,
  userId,
  setNavOpen,
}: SidebarProps) {
  const router = useRouter();

  return (
    <div
      onTransitionEnd={handleAnimation}
      className={`${
        animateTrigger ? "" : "translate-x-40"
      } absolute right-0 top-0 flex h-screen w-48 flex-col border-l border-l-neutral-300 pt-10 backdrop-blur-md transition-transform`}
    >
      <ul>
        <li
          onMouseDown={() => {
            router.push("/");
          }}
          className="bg-blue flex w-full px-8 py-4 text-white hover:cursor-pointer hover:bg-emerald-400 hover:text-white"
        >
          <HomeIcon />
          Home
        </li>
        <li
          onMouseDown={() => {
            router.push(`/${userId}/schedule`);
          }}
          className="flex w-full px-8 py-4 text-white hover:cursor-pointer hover:bg-emerald-400 hover:text-white"
        >
          <CalendarMonthIcon />
          Calander
        </li>
        <li
          onMouseDown={() => {
            setNavOpen(false);
            router.push(`/${userId}/listboards`);
          }}
          className="flex w-full px-8 py-4 text-white hover:cursor-pointer hover:bg-emerald-400 hover:text-white"
        >
          <DashboardIcon />
          Listboards
        </li>
        <li
          onMouseDown={() => {
            router.push(`/${userId}/mystats`);
          }}
          className="flex w-full px-8 py-4 text-white hover:cursor-pointer hover:bg-emerald-400 hover:text-white"
        >
          <ShowChartIcon />
          Charts
        </li>
        <li
          onMouseDown={() => {
            router.push(`/${userId}/preference`);
          }}
          className="flex w-full px-8 py-4 text-white hover:cursor-pointer hover:bg-emerald-400 hover:text-white"
        >
          <SettingsIcon />
          Preference
        </li>
        <li
          className="flex w-full px-8 py-4 text-white hover:cursor-pointer hover:bg-emerald-400 hover:text-white"
          onMouseDown={() => signOut({ callbackUrl: "http://localhost:3000" })}
        >
          <ExitToAppIcon />
          Sign Out
        </li>
      </ul>
    </div>
  );
}

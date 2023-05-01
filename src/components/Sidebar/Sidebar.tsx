import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

type SidebarProps = {
  animateTrigger: boolean;
  handleAnimation: () => void;
};

export default function Sidebar({
  animateTrigger,
  handleAnimation,
}: SidebarProps) {
  return (
    <div
      onTransitionEnd={handleAnimation}
      className={`${
        animateTrigger ? "" : "translate-x-40"
      } absolute right-0 top-0 flex h-screen w-48 flex-col items-center border-l border-l-neutral-300 pt-8 backdrop-blur-md transition-transform`}
    >
      <ul>
        <li className="mb-8 flex w-full text-neutral-600">
          <CalendarMonthIcon />
          Calander
        </li>
        <li className="mb-8 flex w-full text-neutral-600">
          <DashboardIcon />
          Listboardss
        </li>
        <li className="mb-8 flex w-full text-neutral-600">
          <ShowChartIcon />
          Charts
        </li>
        <li className="mb-8 flex w-full text-neutral-600">
          <SettingsIcon />
          Preference
        </li>
        <li className="mb-8 flex w-full text-neutral-600">
          <ExitToAppIcon />
          Sign Out
        </li>
      </ul>
    </div>
  );
}

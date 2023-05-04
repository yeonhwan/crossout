// Libs
import dayjs from "dayjs";

// Props TYPE
type DateProps = {
  dateInfo: Date;
};

export default function DateTimer({ dateInfo }: DateProps) {
  const now = dayjs(dateInfo).format("YYYY-MMM-D-ddd");
  const year = now.split("-")[0] as string;
  const month = now.split("-")[1] as string;
  const date = now.split("-")[2] as string;
  const day = now.split("-")[3] as string;

  const generateDateSup = (date: string): string => {
    switch (date) {
      case "1":
        return "st";
      case "2":
        return "nd";
      case "3":
        return "rd";

      default:
        return "th";
    }
  };

  return (
    <div className="text-4xl font-extrabold">
      <span className="mr-2 text-lg font-semibold">{year}</span>
      <span className="mr-2">
        {`${month} ${date}`}
        <span className="text-base font-semibold">{generateDateSup(date)}</span>
      </span>
      <span className="mr-2 text-xl font-bold">{day}</span>
    </div>
  );
}

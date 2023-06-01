import { ResponsiveTimeRange } from "@nivo/calendar";

const YearChart = () => {
  const data = [
    {
      value: 370,
      day: "2022-12-31",
    },
    {
      value: 306,
      day: "2022-01-01",
    },
    {
      value: 261,
      day: "2022-01-01",
    },
    {
      value: 69,
      day: "2022-03-13",
    },
  ];

  return (
    <div className="flex h-full w-full min-w-[800px] max-w-[1000px]">
      <ResponsiveTimeRange
        data={data}
        from="2022/01/01"
        to="2023/01/01"
        emptyColor="#585858d2"
        colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
        margin={{ top: 100, right: 50, bottom: 20, left: 20 }}
        dayBorderWidth={0}
        dayRadius={2}
        daySpacing={3}
        theme={{
          textColor: "white",
          fontSize: 12,
        }}
      />
    </div>
  );
};

export default YearChart;

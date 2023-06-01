import { linearGradientDef } from "@nivo/core";
import { ResponsivePie } from "@nivo/pie";

const DoughnutChart = () => {
  const data = [
    {
      id: "completed",
      label: "completed",
      value: 558,
      color: "hsl(65, 70%, 50%)",
    },
    {
      id: "not yet",
      label: "not yet",
      value: 484,
      color: "#ffffff",
    },
  ];

  return (
    <ResponsivePie
      data={data}
      innerRadius={0.7}
      activeOuterRadiusOffset={5}
      cornerRadius={5}
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      arcLabelsTextColor="#ffffff"
      padAngle={0.7}
      enableArcLinkLabels={false}
      colors={["#099038ea", "#44444485"]}
      defs={[
        linearGradientDef("greenGradient", [
          { offset: 0, color: "#4df387d2" },
          { offset: 100, color: "#099038ea" },
        ]),
        linearGradientDef("grayGradient", [
          { offset: 0, color: "#818080" },
          { offset: 100, color: "#44444485" },
        ]),
      ]}
      fill={[
        { match: { id: "completed" }, id: "greenGradient" },
        { match: { id: "not yet" }, id: "grayGradient" },
      ]}
      legends={[
        {
          anchor: "top-left",
          direction: "column",
          justify: false,
          translateX: -10,
          translateY: -10,
          itemWidth: 100,
          itemHeight: 20,
          itemsSpacing: 0,
          symbolSize: 10,
          itemTextColor: "#fffff",
          itemDirection: "left-to-right",
          symbolShape: "circle",
        },
      ]}
      theme={{
        tooltip: {
          container: {
            background: "#717171",
            fontSize: 10,
            color: "white",
          },
        },
      }}
    />
  );
};

export default DoughnutChart;

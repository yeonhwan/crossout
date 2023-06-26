import { linearGradientDef } from "@nivo/core";
import { ResponsivePie } from "@nivo/pie";
import NoChartIcons from "public/icons/no_chart.svg";

type DoughnutChartProps = {
  data:
    | {
        id: string;
        label: string;
        value: number;
      }[]
    | {
        id: string;
        label: string;
        value: number;
      }[]
    | {
        id: string;
        label: string;
        value: number;
      }[];
  isLight: boolean;
};

const DoughnutChart = ({ data, isLight }: DoughnutChartProps) => {
  console.log(data);
  if (data.length) {
    return (
      <ResponsivePie
        data={data}
        innerRadius={0.5}
        activeOuterRadiusOffset={5}
        cornerRadius={5}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        arcLabelsTextColor="#ffffff"
        padAngle={0.7}
        enableArcLinkLabels={false}
        colors={(d) => {
          switch (d.id) {
            case "terrible":
              return "#922020d2";
            case "bad":
              return "#c76954";
            case "normal":
              return "#d6cd1cc7";
            case "good":
              return "#29e392";
            case "happy":
              return "#13d1b8";
            case "not yet":
              return "#717171";
            case "completed":
              return "#4df387d2";
            case "profit":
              return "#099038ea";
            case "loss":
              return "#92321eea";
            default:
              return "#ffffff";
          }
        }}
        defs={[
          linearGradientDef("greenGradient", [
            { offset: 0, color: "#4df387d2" },
            { offset: 100, color: "#099038ea" },
          ]),
          linearGradientDef("redGradient", [
            { offset: 0, color: "#f48971d2" },
            { offset: 100, color: "#92321eea" },
          ]),
          linearGradientDef("grayGradient", [
            { offset: 0, color: "#818080" },
            { offset: 100, color: "#44444485" },
          ]),
        ]}
        fill={[
          { match: { id: "completed" }, id: "greenGradient" },
          { match: { id: "not yet" }, id: "grayGradient" },
          { match: { id: "loss" }, id: "redGradient" },
          { match: { id: "profit" }, id: "greenGradient" },
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
          legends: {
            text: {
              color: isLight ? "black" : "white",
            },
          },
          labels: {
            text: {
              fontSize: 15,
            },
          },
          tooltip: {
            container: {
              background: "#474747",
              fontSize: 10,
              color: "white",
            },
          },
        }}
      />
    );
  } else {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <NoChartIcons className="m-0 h-24 w-24 stroke-neutral-700 dark:stroke-white" />
        <p className="mt-2 font-bold text-neutral-700 dark:text-white">
          Oops, Nothing to show
        </p>
        <p className="flex flex-col items-center text-xs text-neutral-700 dark:text-white">
          No datas exist in this period.
        </p>
      </div>
    );
  }
};

export default DoughnutChart;

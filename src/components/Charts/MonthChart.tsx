import { ResponsiveBar } from "@nivo/bar";

const MonthChart = () => {
  const data = [
    { date: "1", todos: 0, completed: 0 },
    { date: "2", todos: 1, completed: 4 },
    { date: "3", todos: 2, completed: 4 },
    { date: "4", todos: 5, completed: 4 },
    { date: "5", todos: 4, completed: 4 },
    { date: "6", todos: 5, completed: 4 },
    { date: "7", todos: 6, completed: 4 },
    { date: "8", todos: 7, completed: 4 },
    { date: "9", todos: 5, completed: 4 },
    { date: "10", todos: 5, completed: 4 },
    { date: "11", todos: 5, completed: 4 },
    { date: "12", todos: 5, completed: 4 },
    { date: "13", todos: 5, completed: 4 },
    { date: "14", todos: 2, completed: 0 },
    { date: "15", todos: 10, completed: 4 },
    { date: "16", todos: 5, completed: 4 },
    { date: "17", todos: 5, completed: 4 },
    { date: "18", todos: 20, completed: 4 },
    { date: "19", todos: 5, completed: 4 },
    { date: "20", todos: 5, completed: 4 },
    { date: "21", todos: 5, completed: 4 },
    { date: "22", todos: 5, completed: 4 },
    { date: "23", todos: 5, completed: 4 },
    { date: "24", todos: 5, completed: 30 },
    { date: "25", todos: 5, completed: 4 },
    { date: "26", todos: 5, completed: 4 },
    { date: "27", todos: 5, completed: 4 },
    { date: "28", todos: 5, completed: 4 },
    { date: "29", todos: 2, completed: 0 },
    { date: "30", todos: 6, completed: 4 },
  ];

  const keys = ["todos", "completed"];

  return (
    <div className="flex h-full w-full min-w-[600px] max-w-[1000px]">
      <ResponsiveBar
        indexBy="date"
        keys={keys}
        data={data}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.6}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        enableGridY={false}
        axisLeft={null}
        enableLabel={false}
        borderRadius={3}
        colors={["#656565", "#4ee588"]}
        defs={[
          {
            id: "todos",
            background: "#575757ff",
          },
          {
            id: "completed",
            background: "#29b25e",
          },
        ]}
        fill={[
          { match: { id: "todos" }, id: "todos" },
          { match: { id: "completed" }, id: "completed" },
        ]}
        theme={{
          textColor: "white",
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "top-left",
            direction: "column",
            itemWidth: 83,
            itemHeight: 20,
            symbolShape: "circle",
            translateY: -20,
          },
        ]}
      />
    </div>
  );
};

export default MonthChart;

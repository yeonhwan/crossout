// lottie
import Terrible from "public/lottie/terrible.json";
import Bad from "public/lottie/bad.json";
import Normal from "public/lottie/normal.json";
import Good from "public/lottie/good.json";
import Happy from "public/lottie/happy.json";

//libs
import { replaceColor } from "lottie-colorify";
import { useLottie, type LottieOptions } from "lottie-react";

type MoodRenderProps = {
  mood: "terrible" | "bad" | "normal" | "good" | "happy";
};

const MoodRender = ({ mood }: MoodRenderProps) => {
  const terribleOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Terrible),
    loop: true,
  };

  const badOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Bad),
    loop: true,
  };

  const normalOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Normal),
    loop: true,
  };

  const goodOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Good),
    loop: true,
  };

  const happyOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Happy),
    loop: true,
  };

  const { View: terribleView } = useLottie(terribleOptions);
  const { View: badView } = useLottie(badOptions);
  const { View: normalView } = useLottie(normalOptions);
  const { View: goodView } = useLottie(goodOptions);
  const { View: happyView } = useLottie(happyOptions);

  return (
    <div
      className={`h-8 w-8 rounded-full ${
        mood === "terrible"
          ? "bg-red-700"
          : mood === "bad"
          ? "bg-red-400"
          : mood === "normal"
          ? "bg-yellow-400"
          : mood === "good"
          ? "bg-emerald-500"
          : mood === "happy"
          ? "bg-cyan-500"
          : ""
      }`}
    >
      {mood === "terrible"
        ? terribleView
        : mood === "bad"
        ? badView
        : mood === "normal"
        ? normalView
        : mood === "good"
        ? goodView
        : mood === "happy"
        ? happyView
        : null}{" "}
    </div>
  );
};

export default MoodRender;

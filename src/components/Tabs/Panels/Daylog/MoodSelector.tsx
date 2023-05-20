//libs
import Tooltip from "@mui/material/Tooltip";
import { replaceColor } from "lottie-colorify";
import { useLottie, type LottieOptions } from "lottie-react";

// lottie
import Terrible from "public/lottie/terrible.json";
import Bad from "public/lottie/bad.json";
import Normal from "public/lottie/normal.json";
import Good from "public/lottie/good.json";
import Happy from "public/lottie/happy.json";

// types
import { type Mood } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";

type MoodSelectorProps = {
  selected: Mood;
  onChange: Dispatch<SetStateAction<Mood>>
}

const MoodSelector = ({selected, onChange}:MoodSelectorProps) => {


  const terribleOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Terrible),
    loop: true,
    autoplay: selected === "terrible",
  };

  const badOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Bad),
    loop: true,
    autoplay: selected === "bad",
  };


  const normalOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Normal),
    loop: true,
    autoplay: selected === "normal",
  };

  const goodOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Good),
    loop: true,
    autoplay: selected === "good",
  };

  const happyOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Happy),
    loop: true,
    autoplay: selected === "happy",
  };

  const { View: terribleView, play: terriblePlay, stop: terribleStop} = useLottie(terribleOptions);
  const { View: badView,      play: badPlay,      stop: badStop } = useLottie(badOptions);
  const { View: normalView,   play: normalPlay,   stop: normalStop} = useLottie(normalOptions);
  const { View: goodView,     play: goodPlay,     stop: goodStop} = useLottie(goodOptions);
  const { View: happyView,    play: happyPlay,    stop: happyStop} = useLottie(happyOptions);

  const mouseOverHandler = (mood:string, play:()=>void) => {
    if(selected!==mood) {
      play();
    }
  }

  const mouseOutHandler = (mood:string, stop:()=>void) => {
    if(selected!==mood) {
      stop();
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center py-2">
      <Tooltip title="terrible" arrow placement="bottom">
        <div
          className={`h-10 w-10 hover:cursor-pointer transition-all ${selected === "terrible" ? "bg-red-800" : "bg-transparent"} rounded-full`}
          onMouseOver={() => {mouseOverHandler('terrible', terriblePlay)}}
          onMouseLeave={()=>{mouseOutHandler('terrible', terribleStop)}}
          onClick={()=>{onChange("terrible")}}
          >
          {terribleView}
        </div>
      </Tooltip>
      <Tooltip title="bad" arrow placement="bottom">
        <div
          className={`h-10 w-10 hover:cursor-pointer transition-all ${selected === "bad" ? "bg-red-600" : "bg-transparent"} rounded-full`}
          onMouseOver={() => {mouseOverHandler('bad', badPlay)}}
          onMouseLeave={()=>{mouseOutHandler('bad', badStop)}}
          onClick={()=>{onChange("bad")}}
          >
          {badView}
        </div>
      </Tooltip>
      <Tooltip title="normal" arrow placement="bottom">
        <div
          className={`h-10 w-10 hover:cursor-pointer transition-all ${selected === "normal" ? "bg-yellow-600" : "bg-transparent"} rounded-full`}
          onMouseOver={() => {mouseOverHandler('normal', normalPlay)}}
          onMouseLeave={()=>{mouseOutHandler('normal', normalStop)}}
          onClick={()=>{onChange("normal")}}
          >
          {normalView}
        </div>
        </Tooltip>
      <Tooltip title="good" arrow placement="bottom">
        <div
          className={`h-10 w-10 hover:cursor-pointer transition-all ${selected === "good" ? "bg-emerald-600" : "bg-transparent"} rounded-full`}
          onMouseOver={() => {mouseOverHandler('good', goodPlay)}}
          onMouseLeave={()=>{mouseOutHandler('good', goodStop)}}
          onClick={()=>{onChange("good")}}
          >
          {goodView}
        </div>
        </Tooltip>
      <Tooltip title="happy" arrow placement="bottom">
        <div
          className={`h-10 w-10 hover:cursor-pointer transition-all ${selected === "happy" ? "bg-cyan-600" : "bg-transparent"} rounded-full`}
          onMouseOver={() => {mouseOverHandler('happy', happyPlay)}}
          onMouseLeave={()=>{mouseOutHandler('happy', happyStop)}}
          onClick={()=>{onChange("happy")}}
          >
          {happyView}
        </div>
        </Tooltip>
    </div>
  );
};

export default MoodSelector;

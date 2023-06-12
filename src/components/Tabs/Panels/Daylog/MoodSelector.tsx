// React, hooks
import { useState, useEffect ,type MutableRefObject } from "react";

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

type MoodSelectorProps = {
  moodData: Mood;
  selectedMoodRef: MutableRefObject<Mood | undefined>
}

const MoodSelector = ({moodData, selectedMoodRef}:MoodSelectorProps) => {

  const [selectedMood, setSelectedMood] = useState(moodData);


  useEffect(() => {
    setSelectedMood(moodData);
  }, [moodData])


  const terribleOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Terrible),
    loop: true,
    autoplay: selectedMood === "terrible",
  };

  const badOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Bad),
    loop: true,
    autoplay: selectedMood === "bad",
  };


  const normalOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Normal),
    loop: true,
    autoplay: selectedMood === "normal",
  };

  const goodOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Good),
    loop: true,
    autoplay: selectedMood === "good",
  };

  const happyOptions: LottieOptions = {
    animationData: replaceColor("#000000", "#ffffff", Happy),
    loop: true,
    autoplay: selectedMood === "happy",
  };

  const { View: terribleView, play: terriblePlay, stop: terribleStop} = useLottie(terribleOptions);
  const { View: badView,      play: badPlay,      stop: badStop } = useLottie(badOptions);
  const { View: normalView,   play: normalPlay,   stop: normalStop} = useLottie(normalOptions);
  const { View: goodView,     play: goodPlay,     stop: goodStop} = useLottie(goodOptions);
  const { View: happyView,    play: happyPlay,    stop: happyStop} = useLottie(happyOptions);

  const mouseOverHandler = (mood:string, play:()=>void) => {
    if(selectedMood!==mood) {
      play();
    }
  }

  const mouseOutHandler = (mood:string, stop:()=>void) => {
    if(selectedMood!==mood) {
      stop();
    }
  }

  const onClickHandler = (value:Mood) => {
    setSelectedMood(value);
  }

  useEffect(() => {
    selectedMoodRef.current = selectedMood;
  }, [selectedMood, selectedMoodRef])

  return (
    <div className="flex flex-col w-full h-max">
      <p className="mb-1 self-center dark:text-neutral-300 text-neutral-600 text-sm">
        {selectedMood.toUpperCase()}
      </p>
    <div className="flex h-max w-max justify-center self-center transition-colors rounded-xl border-2 dark:bg-neutral-800/70 dark:border-neutral-700 border-neutral-300 bg-neutral-400/70 px-2">
      <div className="flex h-full w-full items-center justify-center py-2">
        <Tooltip title="terrible" arrow placement="bottom">
          <div
            className={`h-8 w-8 hover:bg-neutral-500 hover:cursor-pointer transition-all ${selectedMood === "terrible" ? "bg-red-800" : "bg-transparent"} rounded-full`}
            onMouseOver={() => {mouseOverHandler('terrible', terriblePlay)}}
            onMouseLeave={()=>{mouseOutHandler('terrible', terribleStop)}}
            onClick={()=>{onClickHandler("terrible")}}
            >
            {terribleView}
          </div>
        </Tooltip>
        <Tooltip title="bad" arrow placement="bottom">
          <div
            className={`h-8 w-8 hover:bg-neutral-500 hover:cursor-pointer transition-all ${selectedMood === "bad" ? "bg-red-600" : "bg-transparent"} rounded-full`}
            onMouseOver={() => {mouseOverHandler('bad', badPlay)}}
            onMouseLeave={()=>{mouseOutHandler('bad', badStop)}}
            onClick={()=>{onClickHandler("bad")}}
            >
            {badView}
          </div>
        </Tooltip>
        <Tooltip title="normal" arrow placement="bottom">
          <div
            className={`h-8 w-8 hover:bg-neutral-500 hover:cursor-pointer transition-all ${selectedMood === "normal" ? "bg-yellow-600" : "bg-transparent"} rounded-full`}
            onMouseOver={() => {mouseOverHandler('normal', normalPlay)}}
            onMouseLeave={()=>{mouseOutHandler('normal', normalStop)}}
            onClick={()=>{onClickHandler("normal")}}
            >
            {normalView}
          </div>
          </Tooltip>
        <Tooltip title="good" arrow placement="bottom">
          <div
            className={`h-8 w-8 hover:bg-neutral-500 hover:cursor-pointer transition-all ${selectedMood === "good" ? "bg-emerald-600" : "bg-transparent"} rounded-full`}
            onMouseOver={() => {mouseOverHandler('good', goodPlay)}}
            onMouseLeave={()=>{mouseOutHandler('good', goodStop)}}
            onClick={()=>{onClickHandler("good")}}
            >
            {goodView}
          </div>
          </Tooltip>
        <Tooltip title="happy" arrow placement="bottom">
          <div
            className={`h-8 w-8 hover:bg-neutral-500 hover:cursor-pointer transition-all ${selectedMood === "happy" ? "bg-cyan-600" : "bg-transparent"} rounded-full`}
            onMouseOver={() => {mouseOverHandler('happy', happyPlay)}}
            onMouseLeave={()=>{mouseOutHandler('happy', happyStop)}}
            onClick={()=>{onClickHandler("happy")}}
            >
            {happyView}
          </div>
          </Tooltip>
      </div>
    </div>
  </div>
  );
};

export default MoodSelector;

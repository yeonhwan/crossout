// React, hooks
import { useState } from "react";
import { type Mood } from "@prisma/client";

// components
import MoodSelector from "@/components/Tabs/Panels/Daylog/MoodSelector";
import TextEditor from "@/components/Editor/TextEditor";

const DaylogPanel = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>("normal");

  return (
    <div className="mt-4 flex h-[90%] max-h-[500px] w-3/5 flex-col rounded-lg bg-neutral-400/40 px-4 py-2 backdrop-blur-sm">
      <div className="mb-2 flex h-max w-full flex-col">
        <p className="self-center text-lg font-bold text-neutral-800">
          Today's Feeling
        </p>
        <p className="mb-1 self-center text-neutral-600">
          {selectedMood.toUpperCase()}
        </p>
        <div className="flex h-max w-max justify-center self-center rounded-xl border-2 border-neutral-500 bg-neutral-800/70 px-2">
          <MoodSelector selected={selectedMood} onChange={setSelectedMood} />
        </div>
      </div>
      <p className="mb-2 self-center text-lg font-bold text-neutral-800">
        Daylog
      </p>
      <div className="flex h-4/5 w-full">
        <TextEditor />
      </div>
    </div>
  );
};

export default DaylogPanel;

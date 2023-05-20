// React, hooks
import { useState } from "react";
import { type Mood } from "@prisma/client";

// components
import MoodSelector from "@/components/Tabs/Panels/Daylog/MoodSelector";

const DaylogPanel = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>("normal");

  return (
    <div className="mt-4 flex h-[80%] max-h-[450px] w-3/5 flex-col rounded-lg bg-neutral-400/40 px-4 py-2 backdrop-blur-sm">
      <p className="self-center text-xl font-bold text-neutral-800">
        Today's Feeling
      </p>
      <p className="mb-2 self-center text-neutral-600">
        {selectedMood.toUpperCase()}
      </p>
      <div className="flex h-max w-max justify-center self-center rounded-xl border-2 border-neutral-500 bg-neutral-800/70 px-2">
        <MoodSelector selected={selectedMood} onChange={setSelectedMood} />
      </div>
      <textarea
        placeholder="Write down your today's daylog / journal in here"
        className="mt-2"
      />
    </div>
  );
};

export default DaylogPanel;

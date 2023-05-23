// React, hooks
import { useState, useRef } from "react";
import { type Mood } from "@prisma/client";

// components
import MoodSelector from "@/components/Tabs/Panels/Daylog/MoodSelector";
import TextEditor from "@/components/Editor/TextEditor";

// libs
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import EditorTheme from "@/components/Editor/theme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import {
  type SerializedEditorState,
  type SerializedLexicalNode,
} from "lexical";

// api
import { api } from "@/utils/api";

// stores
import useDateStore from "@/stores/useDateStore";

// types
import { type InitialConfigType } from "@lexical/react/LexicalComposer";

const DaylogPanel = () => {
  const [moodData, setMoodData] = useState<Mood>("normal");
  const [editorContentData, setEditorContentData] = useState<string>();
  const editorStateRef = useRef<SerializedEditorState<SerializedLexicalNode>>();
  const selectedMoodRef = useRef<Mood>();
  const { year, month, date } = useDateStore((state) => state.dateObj);

  const { isLoading } = api.daylog.getDaylog.useQuery(
    { data: { dateObject: { year, month, date } } },
    {
      queryKey: [
        "daylog.getDaylog",
        { data: { dateObject: { year, month, date } } },
      ],
      onSuccess: (res) => {
        const daylog = res.data;
        if (daylog) {
          const { mood, content } = daylog;
          setMoodData(mood);
          setEditorContentData(content);
        } else {
          setMoodData("normal");
          setEditorContentData(undefined);
        }
      },

      onError: (err) => {
        console.log(err);
      },
    }
  );

  const { mutate: upsertDaylog } = api.daylog.upsertDaylog.useMutation({
    onSuccess: (res) => {
      console.log(res);
    },

    onError: (err) => {
      console.log(err);
    },
  });

  const updateHandler = () => {
    upsertDaylog({
      data: {
        content: JSON.stringify(editorStateRef.current),
        mood: selectedMoodRef.current ? selectedMoodRef.current : "normal",
      },
      dateObj: { year, month, date },
    });
  };

  const ContentRender = () => {
    if (isLoading) {
      return <p>loading...</p>;
    }

    const editorConfig: InitialConfigType = {
      theme: EditorTheme,
      namespace: "daylogEditor",
      onError(error: Error) {
        throw error;
      },
      nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
    };

    return (
      <>
        <div className="mb-2 flex h-max w-full flex-col">
          <p className="self-center text-lg font-bold text-neutral-800">
            Today's Feeling
          </p>
          <MoodSelector moodData={moodData} selectedMoodRef={selectedMoodRef} />
        </div>
        <p className="mb-2 self-center text-lg font-bold text-neutral-800">
          Daylog
        </p>
        <div className="flex h-4/5 w-full">
          <LexicalComposer initialConfig={editorConfig}>
            <TextEditor
              isContentLoading={isLoading}
              editorStateRef={editorStateRef}
              editorContent={editorContentData}
            />
          </LexicalComposer>
        </div>
      </>
    );
  };

  return (
    <div className="mt-4 flex h-[90%] max-h-[500px] w-3/5 flex-col rounded-lg bg-neutral-400/40 px-4 py-2 backdrop-blur-sm">
      {ContentRender()}
      <button>SAVE</button>
    </div>
  );
};

export default DaylogPanel;

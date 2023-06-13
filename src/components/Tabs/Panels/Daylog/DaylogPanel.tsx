// React, hooks
import { useState, useRef } from "react";
import { type Mood } from "@prisma/client";

// components
import MoodSelector from "@/components/Tabs/Panels/Daylog/MoodSelector";
import TextEditor from "@/components/Editor/TextEditor";
import CircleButton from "@/components/Buttons/CircleButton";

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
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

// types
import { type InitialConfigType } from "@lexical/react/LexicalComposer";

// ICONS
import SaveIcon from "public/icons/save.svg";
import LoaderIcon from "public/icons/spinner.svg";

const DaylogPanel = () => {
  const [moodData, setMoodData] = useState<Mood>("normal");
  const [editorContentData, setEditorContentData] = useState<string>();
  const editorStateRef = useRef<SerializedEditorState<SerializedLexicalNode>>();
  const selectedMoodRef = useRef<Mood>();
  const { year, month, date } = useDateStore((state) => state.dateObj);
  const { setSnackbarOpen, setSnackbarData } = useSnackbarStore(
    (state) => state
  );
  const utils = api.useContext();

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

  const { mutate: upsertDaylog, isLoading: isUpserting } =
    api.daylog.upsertDaylog.useMutation({
      onSuccess: async (res) => {
        if (res) {
          const { message } = res.data;
          await utils.daylog.getDaylog.invalidate();
          setSnackbarOpen(true);
          setSnackbarData({ message, role: SnackbarRole.Success });
        }
      },

      onError: (err) => {
        const { message } = err;
        setSnackbarOpen(true);
        setSnackbarData({ message, role: SnackbarRole.Error });
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
      return (
        <div className="flex h-full w-full items-center justify-center">
          <LoaderIcon className="h-10 w-10" />
        </div>
      );
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
          <div className="absolute right-3 top-3 flex">
            <span className="flex items-center justify-center">
              <LoaderIcon
                className={`h-8 w-8 fill-white ${
                  isUpserting ? "opacity-100" : "opacity-0"
                }`}
              />
            </span>
            <CircleButton
              className={`${
                isUpserting
                  ? "pointer-events-none bg-neutral-300 dark:bg-neutral-400"
                  : "hover:bg-cyan-400 dark:hover:bg-cyan-500"
              }`}
              onClick={updateHandler}
              info="save"
            >
              <SaveIcon fill="white" className="h-4 w-4" />
            </CircleButton>
          </div>
          <p className="self-center font-bold text-neutral-800 dark:text-white">
            Today's Feeling
          </p>
          <MoodSelector moodData={moodData} selectedMoodRef={selectedMoodRef} />
        </div>
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
    <div className="mt-4 flex h-[90%] max-h-[500px] w-3/5 flex-col rounded-lg bg-neutral-300/40 px-4 py-2 backdrop-blur-sm transition-colors dark:bg-neutral-800/40">
      {ContentRender()}
    </div>
  );
};

export default DaylogPanel;

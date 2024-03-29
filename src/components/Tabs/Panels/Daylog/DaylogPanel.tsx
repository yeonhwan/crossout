// components
import MoodSelector from "@/components/Tabs/Panels/Daylog/MoodSelector";
import TextEditor from "@/components/Editor/TextEditor";
import CircleButton from "@/components/Buttons/CircleButton";

// hooks
import { useState, useRef, useEffect } from "react";

// libs
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import EditorTheme from "@/components/Editor/theme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";

// api
import { api } from "@/utils/api";

// stores
import useDateStore from "@/stores/useDateStore";
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

// icons
import SaveIcon from "public/icons/save.svg";
import LoaderIcon from "public/icons/spinner.svg";

// types
import type { SerializedEditorState, SerializedLexicalNode } from "lexical";
import type { Mood } from "@prisma/client";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import type { GetDayLogOutput } from "@/utils/api";

type DaylogPanelProps = {
  data: GetDayLogOutput["data"] | undefined;
  isDaylogLoading: boolean;
};

const DaylogPanel = ({ data, isDaylogLoading }: DaylogPanelProps) => {
  const [moodData, setMoodData] = useState<Mood>();
  const [editorContentData, setEditorContentData] = useState<string>();
  const editorStateRef = useRef<SerializedEditorState<SerializedLexicalNode>>();
  const selectedMoodRef = useRef<Mood>();
  const { year, month, date } = useDateStore((state) => state.dateObj);
  const { setSnackbarOpen, setSnackbarData } = useSnackbarStore(
    (state) => state
  );
  const utils = api.useContext();

  useEffect(() => {
    setMoodData(data ? data.mood : "normal");
    setEditorContentData(data ? data.content : undefined);
  }, [data]);

  // upsert/save daylog all contents api call
  const { mutate: upsertDaylog, isLoading: isUpserting } =
    api.daylog.upsertDaylog.useMutation({
      onSuccess: async (res) => {
        if (res) {
          await utils.daylog.getDaylog.invalidate();
          setSnackbarOpen(true);
          setSnackbarData({
            message: "Updated current daylog",
            role: SnackbarRole.Success,
          });
        }
      },

      onError: () => {
        setSnackbarOpen(true);
        setSnackbarData({
          message: "Request failed. Please try again or report the issue.",
          role: SnackbarRole.Error,
        });
      },
    });

  // Handler
  const saveButtonHandler = () => {
    upsertDaylog({
      data: {
        content: JSON.stringify(editorStateRef.current),
        mood: selectedMoodRef.current ? selectedMoodRef.current : "normal",
      },
      dateObj: { year, month, date },
    });
  };

  const ContentRender = () => {
    if (isDaylogLoading) {
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
                className={`h-8 w-8 fill-neutral-700 dark:fill-white ${
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
              onClick={saveButtonHandler}
              info="save"
            >
              <SaveIcon fill="white" className="h-4 w-4" />
            </CircleButton>
          </div>
          <p className="self-center text-xs font-bold text-neutral-800 dark:text-white sm:text-base">
            Today's Feeling
          </p>
          <MoodSelector moodData={moodData} selectedMoodRef={selectedMoodRef} />
        </div>
        <div className="flex h-4/5 w-full">
          <LexicalComposer initialConfig={editorConfig}>
            <TextEditor
              isContentLoading={isDaylogLoading}
              editorStateRef={editorStateRef}
              editorContent={editorContentData}
              isUpserting={isUpserting}
            />
          </LexicalComposer>
        </div>
      </>
    );
  };

  return (
    <div className="relative mt-4 flex h-[90%] w-[90%] flex-col rounded-lg bg-neutral-300/40 px-4 py-2 backdrop-blur-sm transition-colors dark:bg-neutral-800/60 mobile:h-[95%] sm:h-[80%] lg:w-3/5">
      {ContentRender()}
    </div>
  );
};

export default DaylogPanel;

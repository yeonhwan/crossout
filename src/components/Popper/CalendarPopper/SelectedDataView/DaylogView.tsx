// lexical (Editor)
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import UpdatePlugin from "@/components/Editor/plugins/UpdatePlugin";

// types
import { type InitialConfigType } from "@lexical/react/LexicalComposer";
import { type SelectedDateDateType } from "@/types/client";

// components
import MoodRender from "@/components/Popper/CalendarPopper/SelectedDataView/MoodRender";

type DaylogViewProps = {
  data: SelectedDateDateType;
};

const DaylogView = ({ data }: DaylogViewProps) => {
  const daylogs = data.daylogs!;

  // editor setting
  const editorState = JSON.stringify(daylogs.content);
  const mood = daylogs.mood;

  const initialConfig: InitialConfigType = {
    editorState,
    editable: false,
    namespace: "readOnlyEditor",
    onError: (err) => {
      throw new Error("Text Editor Error Happened", err);
    },
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
  };

  return (
    <div className="flex h-full w-full flex-col px-8 py-4">
      <p className="self-center text-lg font-semibold text-white">Daylog</p>
      <div className="flex h-full w-full flex-col items-center justify-evenly">
        <MoodRender mood={mood} />
        <LexicalComposer initialConfig={initialConfig}>
          <RichTextPlugin
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
            contentEditable={
              <ContentEditable className="editor-input flex h-[90%] w-[90%] flex-col overflow-y-scroll rounded-lg border-2 border-white bg-neutral-200 p-4 text-sm text-neutral-700 dark:bg-neutral-700 dark:text-white" />
            }
          />
          <ListPlugin />
          <UpdatePlugin newState={editorState} />
        </LexicalComposer>
      </div>
    </div>
  );
};

export default DaylogView;

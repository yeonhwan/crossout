// Lexical (editor)
// plugins
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
// import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import ToolbarPlugin from "@/components/Editor/plugins/Toolbar/ToolbarPlugin";
import AutoFocusPlugin from "@/components/Editor/plugins/AutoFocusPlugin";
// lexcial libs
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode } from "lexical";
import { $isRootTextContentEmpty } from "@lexical/text";

// hooks
import { useRef, useEffect, type MutableRefObject } from "react";
import { useDebouncedCallback } from "use-debounce";

// libs
import _ from "lodash";

// api
import { api } from "@/utils/api";

// icons
import LoaderIcon from "public/icons/spinner.svg";

// store
import useDateStore from "@/stores/useDateStore";
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

// types
import type {
  EditorState,
  SerializedEditorState,
  SerializedLexicalNode,
} from "lexical";

function Placeholder() {
  return (
    <div className="editor-placeholder sm:text-md pointer-events-none absolute text-xs text-neutral-400 dark:text-neutral-500">
      Enter your daylog / journal in here!
    </div>
  );
}

type TextEditorProps = {
  editorContent: string | undefined;
  editorStateRef: MutableRefObject<
    SerializedEditorState<SerializedLexicalNode> | undefined
  >;
  isContentLoading: boolean;
  isUpserting: boolean;
};

const TextEditor = ({
  editorContent,
  editorStateRef,
  isUpserting,
}: TextEditorProps) => {
  const [editor] = useLexicalComposerContext();
  const { dateObj } = useDateStore((state) => state);
  const prevEditorContent = useRef<string | undefined>(editorContent);
  const prevDateObj = useRef(dateObj);
  const { year, month, date } = dateObj;
  const utils = api.useContext();
  const { setSnackbarOpen, setSnackbarData } = useSnackbarStore(
    (state) => state
  );

  // initializing the editor contents
  useEffect(() => {
    if (editorContent) {
      prevEditorContent.current = editorContent;
      const editorState = editor.parseEditorState(editorContent);
      editor.setEditorState(editorState);
    } else {
      prevEditorContent.current = undefined;
      editor.update(() => {
        const root = $getRoot();
        const newPargraphNode = $createParagraphNode();
        root.clear();
        root.append(newPargraphNode);
      });
    }
  }, [editorContent, editor]);

  // if date changes, it stores the data to compare if the editor contents are new
  useEffect(() => {
    prevDateObj.current = dateObj;
  }, [dateObj]);

  // mutate textEditor function (auto saving)
  const { mutate: upsertTextEditor, isLoading: isUpesrting } =
    api.daylog.upsertEditorContent.useMutation({
      onSuccess: async () => {
        await utils.daylog.getDaylog.invalidate();
      },
      onError: () => {
        setSnackbarOpen(true);
        setSnackbarData({
          message: "Autosave failed. Please report the issue.",
          role: SnackbarRole.Error,
        });
      },
    });

  // debouncing the api calls whenever editor contents changed (4000 ms)
  const debouncedUpsertTextEditor = useDebouncedCallback(
    (
      data: {
        data: { content: string };
        dateObj: { year: number; month: number; date: number };
      },
      editorState: EditorState
    ) => {
      const editorStateJSON = editorState.toJSON();
      const prevEditorState = prevEditorContent.current
        ? (JSON.parse(prevEditorContent.current) as EditorState | undefined)
        : undefined;

      const isDiff = !_.isEqual(prevEditorState, editorStateJSON);
      const isDateSame = _.isEqual(prevDateObj.current, dateObj);

      editorState.read(() => {
        const root = $getRoot();
        const isEmpty =
          root.getFirstChild()?.getTextContentSize() === 0 &&
          root.getChildrenSize() === 1;
        const noWhiteSpace = $isRootTextContentEmpty(true, true);

        // api calls if
        // 1. contents are different with lastly saved
        // 2. date is different
        // 3. not empty contents
        // 4. no whitespace (space or enter)
        // 5. not in saving contents state
        if (isDiff && isDateSame && !isEmpty && !noWhiteSpace && !isUpserting) {
          upsertTextEditor(data);
        }
      });
    },
    4000
  );

  // Handlers for on change of editor contents
  // 1. saves the editor states to ref object in JSON Strings for easy to save
  // 2. calls the debounced api mutation fn
  function onChange(editorState: EditorState) {
    editorStateRef.current = editorState.toJSON();
    debouncedUpsertTextEditor(
      {
        data: { content: JSON.stringify(editorStateRef.current) },
        dateObj: { year, month, date },
      },
      editorState
    );
  }

  return (
    <div className="editor-container relative flex h-full w-full flex-col rounded-lg border-2 border-neutral-300 bg-neutral-200 px-6 py-1 transition-colors dark:border-neutral-700 dark:bg-neutral-800">
      <div className="flex h-max w-full">
        <ToolbarPlugin />
        <span className="ml-1 flex items-center justify-center">
          <LoaderIcon
            className={`h-6 w-6 fill-neutral-700 dark:fill-white ${
              isUpesrting ? "opaicty-100" : "opacity-0"
            }`}
          />
        </span>
      </div>
      <div
        className={`editor-inner relative mt-2 flex h-[80%] w-full rounded-md border-2 border-neutral-400 bg-neutral-300 p-2 text-xs shadow-lg transition-colors dark:border-neutral-500 dark:bg-neutral-700 `}
      >
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="scrollable editor-input sm:text-md flex w-full flex-col overflow-y-scroll text-xs text-black focus:outline-none dark:text-white" />
          }
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        {/* for future purpose */}
        {/* <HistoryPlugin /> */}
        <AutoFocusPlugin />
        <OnChangePlugin ignoreSelectionChange={true} onChange={onChange} />
      </div>
    </div>
  );
};

export default TextEditor;

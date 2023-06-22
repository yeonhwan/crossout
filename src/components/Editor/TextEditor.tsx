// Lexical Editor
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  type SerializedEditorState,
  type SerializedLexicalNode,
  $getRoot,
  $createParagraphNode,
} from "lexical";
import { $isRootTextContentEmpty } from "@lexical/text";
import ToolbarPlugin from "@/components/Editor/plugins/Toolbar/ToolbarPlugin";
import AutoFocusPlugin from "@/components/Editor/plugins/AutoFocusPlugin";
import type { EditorState } from "lexical";

// React, hooks
import { useRef, useEffect, type MutableRefObject } from "react";
import { useDebouncedCallback } from "use-debounce";

import LoaderIcon from "public/icons/spinner.svg";

// api
import { api } from "@/utils/api";

// libs
import _ from "lodash";

// store
import useDateStore from "@/stores/useDateStore";
import useSnackbarStore, { SnackbarRole } from "@/stores/useSnackbarStore";

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
};

const TextEditor = ({ editorContent, editorStateRef }: TextEditorProps) => {
  const [editor] = useLexicalComposerContext();
  const { dateObj } = useDateStore((state) => state);
  const prevEditorContent = useRef<string | undefined>(editorContent);
  const prevDateObj = useRef(dateObj);
  const { year, month, date } = dateObj;
  const utils = api.useContext();
  const { setSnackbarOpen, setSnackbarData } = useSnackbarStore(
    (state) => state
  );

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

  useEffect(() => {
    prevDateObj.current = dateObj;
  }, [dateObj]);

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

        if (isDiff && isDateSame && !isEmpty && !noWhiteSpace) {
          upsertTextEditor(data);
        }
      });
    },
    2000
  );

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
            <ContentEditable className="editor-input sm:text-md flex w-full flex-col overflow-y-scroll text-xs text-black focus:outline-none dark:text-white" />
          }
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <OnChangePlugin ignoreSelectionChange={true} onChange={onChange} />
      </div>
    </div>
  );
};

export default TextEditor;

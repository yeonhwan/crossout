import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import TreeViewPlugin from "./plugins/TreeViewPlugin";
import EditorTheme from "./theme";

import { useRef } from "react";

import ToolbarPlugin from "./plugins/Toolbar/ToolbarPlugin";

import AutoFocusPlugin from "./plugins/AutoFocusPlugin";

// function onChange(editorState: EditorState) {
//   editorState.read(() => {
//     // Read the contents of the EditorState here.
//     const root = $getRoot();
//     const selection = $getSelection();

//     console.log(root, selection);
//   });
// }

function Placeholder() {
  return (
    <div className="editor-placeholder pointer-events-none absolute text-neutral-600">
      Enter your daylog / journal in here!
    </div>
  );
}

const editorConfig = {
  theme: EditorTheme,
  namespace: "daylogEditor",
  onError(error: Error) {
    throw error;
  },
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
};

const TextEditor = () => {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container relative flex h-full w-full flex-col rounded-xl">
        <ToolbarPlugin />
        <div
          className={`editor-inner relative mt-1 flex h-3/4 w-full rounded-xl border-2 border-neutral-400 bg-neutral-800 p-2`}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input full flex w-full flex-col overflow-y-scroll focus:outline-none" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ListPlugin />
          <HistoryPlugin />
          <AutoFocusPlugin />
          {/* <TreeViewPlugin /> */}
        </div>
      </div>
    </LexicalComposer>
  );
};

export default TextEditor;

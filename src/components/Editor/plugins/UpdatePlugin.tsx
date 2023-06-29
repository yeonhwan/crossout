// hooks
import { useEffect } from "react";

// Lexical (editor)
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

type updatePluginProps = {
  newState: string;
};

// Plugins for update editor contents used in Calendar Components not in daylog panel

const UpdatePlugin = ({ newState }: updatePluginProps) => {
  const [editor] = useLexicalComposerContext();

  // editor contents updated whenever newState(new data) comes in
  useEffect(() => {
    const editorState = editor.parseEditorState(newState);
    editor.setEditorState(editorState);
  }, [newState, editor]);

  return null;
};

export default UpdatePlugin;

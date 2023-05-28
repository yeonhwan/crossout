import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

type updatePluginProps = {
  newState: string;
};

const UpdatePlugin = ({ newState }: updatePluginProps) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const editorState = editor.parseEditorState(newState);

    editor.setEditorState(editorState);
  }, [newState]);

  return null;
};

export default UpdatePlugin;

// hooks
import { useEffect } from "react";

// Lexcial (editor)
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  // Focus the editor when the effect fires
  useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
}

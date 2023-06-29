// Components
import OptionsDropdown from "@/components/Editor/plugins/Toolbar/OptionsDropdown";

// hooks
import { useState, useEffect, useCallback } from "react";

// Lexical (Editor)
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";

// icons
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isDash, setIsDash] = useState(false);

  // fn to set toolbar buttons to editor contents automatically
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const hasBold = selection.hasFormat("bold");
      const hasItalic = selection.hasFormat("italic");
      const hasUnderline = selection.hasFormat("underline");
      const hasDash = selection.hasFormat("strikethrough");
      setIsBold(hasBold);
      setIsItalic(hasItalic);
      setIsUnderline(hasUnderline);
      setIsDash(hasDash);
    }
  }, []);

  // update toolbar fires whenever editor contents changed
  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  // Handler for clicking toolbar buttons not in dropdown
  const buttonHandler = (value: string) => {
    switch (value) {
      case "bold":
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        break;
      case "italic":
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        break;
      case "underline":
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        break;
      case "dash":
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        break;

      default:
        break;
    }
  };

  return (
    <div className="top-0 mt-1 flex h-10 min-w-max max-w-[40%] justify-around self-center rounded-lg bg-neutral-300 px-0 py-2 dark:bg-neutral-700 sm:p-2">
      <OptionsDropdown />
      <button
        className={`mx-1 flex h-full w-max items-center justify-center p-1 outline-none hover:bg-neutral-400 dark:hover:bg-neutral-600 sm:p-2 ${
          isBold ? "bg-neutral-400" : "bg-neutral-300 dark:bg-neutral-700"
        }`}
        onClick={() => {
          buttonHandler("bold");
        }}
      >
        <FormatBoldIcon
          className={`h-3 w-3 sm:h-4 sm:w-4 ${isBold ? "fill-black" : ""}`}
        />
      </button>
      <button
        className={`mx-1 flex h-full w-max items-center justify-center p-1 outline-none hover:bg-neutral-400 dark:hover:bg-neutral-600 sm:p-2 ${
          isItalic ? "bg-neutral-400" : "bg-neutral-300 dark:bg-neutral-700"
        }`}
        onClick={() => {
          buttonHandler("italic");
        }}
      >
        <div className="flex">
          <FormatItalicIcon
            className={`h-3 w-3 sm:h-4 sm:w-4 ${isItalic ? "fill-black" : ""}`}
          />
        </div>
      </button>
      <button
        className={`mx-1 flex w-max items-center p-1 outline-none hover:bg-neutral-400 dark:hover:bg-neutral-600 sm:p-2 ${
          isUnderline ? "bg-neutral-400" : "bg-neutral-300 dark:bg-neutral-700"
        }`}
        onClick={() => {
          buttonHandler("underline");
        }}
      >
        <FormatUnderlinedIcon
          className={`h-3 w-3 sm:h-4 sm:w-4 ${isUnderline ? "fill-black" : ""}`}
        />
      </button>
      <button
        className={`mx-1 flex w-max items-center p-1 outline-none hover:bg-neutral-400 dark:hover:bg-neutral-600 sm:p-2 ${
          isDash ? "bg-neutral-400" : "bg-neutral-300 dark:bg-neutral-700"
        }`}
        onClick={() => {
          buttonHandler("dash");
        }}
      >
        <StrikethroughSIcon
          className={`h-3 w-3 sm:h-4 sm:w-4 ${isDash ? "fill-black" : ""}`}
        />
      </button>
    </div>
  );
};

export default ToolbarPlugin;

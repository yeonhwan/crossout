import OptionsDropdown from "./OptionsDropdown";

import { FORMAT_TEXT_COMMAND } from "lexical";

import { useState, useEffect, useCallback } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";

// ICONS
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";

const ToolbarPlugin = () => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isDash, setIsDash] = useState(false);

  const [editor] = useLexicalComposerContext();

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

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  return (
    <div className="top-0 flex h-10 min-w-max max-w-[35%] justify-around self-center rounded-lg bg-neutral-800 p-2">
      <OptionsDropdown />
      <button
        className={`flex h-full w-max items-center justify-center p-2 outline-none hover:bg-neutral-600 ${
          isBold ? "bg-neutral-400" : "bg-neutral-800"
        }`}
        onClick={() => {
          buttonHandler("bold");
        }}
      >
        <FormatBoldIcon className={`h-4 w-4 ${isBold ? "fill-black" : ""}`} />
      </button>
      <button
        className={`flex h-full w-max items-center justify-center p-2 outline-none hover:bg-neutral-600 ${
          isItalic ? "bg-neutral-400" : "bg-neutral-800"
        }`}
        onClick={() => {
          buttonHandler("italic");
        }}
      >
        <div className="flex">
          <FormatItalicIcon
            className={`h-4 w-4 ${isItalic ? "fill-black" : ""}`}
          />
        </div>
      </button>
      <button
        className={`flex w-max items-center p-2 outline-none hover:bg-neutral-600 ${
          isUnderline ? "bg-neutral-400" : "bg-neutral-800"
        }`}
        onClick={() => {
          buttonHandler("underline");
        }}
      >
        <FormatUnderlinedIcon
          className={`h-4 w-4 ${isUnderline ? "fill-black" : ""}`}
        />
      </button>
      <button
        className={`flex w-max items-center p-2 outline-none hover:bg-neutral-600 ${
          isDash ? "bg-neutral-400" : "bg-neutral-800"
        }`}
        onClick={() => {
          buttonHandler("dash");
        }}
      >
        <StrikethroughSIcon
          className={`h-4 w-4 ${isDash ? "fill-black" : ""}`}
        />
      </button>
    </div>
  );
};

export default ToolbarPlugin;

// Hooks
import { useState, useEffect, useCallback } from "react";

// libs
import { ClickAwayListener } from "@mui/material";

// Lexical (Editor)
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from "lexical";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import { $getNearestNodeOfType } from "@lexical/utils";

// icons
import ParagraphIcon from "public/icons/paragraph.svg";
import H1Icon from "public/icons/h1.svg";
import H2Icon from "public/icons/h2.svg";
import OLIcon from "public/icons/ol.svg";
import ULIcon from "public/icons/ul.svg";

const selectedToBlockType = {
  Normal: "paragraph",
  Large: "h1",
  Small: "h2",
  Ordered: "ol",
  Bulleted: "ul",
};

const OptionsDropdown = () => {
  const [editor] = useLexicalComposerContext();

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Normal");

  // fn to set dropdown to current ediotr content's styling automatically
  const updateDropdown = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          const dropDownValue = Object.keys(selectedToBlockType).find(
            (key) =>
              selectedToBlockType[key as keyof typeof selectedToBlockType] ===
              type
          );
          if (dropDownValue) {
            setSelected(dropDownValue);
          }
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();

          const dropDownValue = Object.keys(selectedToBlockType).find(
            (key) =>
              selectedToBlockType[key as keyof typeof selectedToBlockType] ===
              type
          );
          if (dropDownValue) {
            setSelected(dropDownValue);
          }
        }
      }
    }
  }, [editor]);

  // update Dropdown whenever editor state changed
  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateDropdown();
      });
    });
  }, [editor, updateDropdown]);

  // formatting editor contents by selected style
  const formatEditor = (value: keyof typeof selectedToBlockType) => {
    const formatTo = selectedToBlockType[value];

    switch (formatTo) {
      case "paragraph":
        if (selected !== "Normal") {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createParagraphNode());
            }
          });
          break;
        }

      case "h1":
        if (selected !== "Large") {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h1"));
            }
          });
          break;
        }

      case "h2":
        if (selected !== "Small") {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h2"));
            }
          });
          break;
        }

      case "ol":
        if (selected !== "Ordered") {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        } else {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        }
        break;

      case "ul":
        if (selected !== "Bulleted") {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        } else {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        }
        break;

      default:
        break;
    }
  };

  const iconsForSelected = (selected: string) => {
    switch (selected) {
      case "Normal":
        return <ParagraphIcon />;
      case "Large":
        return <H1Icon />;
      case "Small":
        return <H2Icon />;
      case "Ordered":
        return <OLIcon />;
      case "Bulleted":
        return <ULIcon />;
    }
  };

  // Handler for clicking dropdown buttons
  const buttonOnClickHandler = (value: keyof typeof selectedToBlockType) => {
    setSelected(value);
    formatEditor(value);
    setIsOpen(false);
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        setIsOpen(false);
      }}
    >
      <div
        onClick={() => {
          editor.focus();
          setIsOpen(true);
        }}
        className="relative flex hover:cursor-pointer"
      >
        <div className="ml-2 flex h-full w-24 items-center justify-center rounded-md bg-neutral-400 text-white dark:bg-neutral-800 sm:w-32">
          <span className="mr-2 h-4 w-4">{iconsForSelected(selected)}</span>
          <span className="text-xs font-bold">{selected}</span>
        </div>
        {isOpen && (
          <div className="absolute left-0 top-7 z-50 flex w-max flex-col justify-between rounded-lg border-2 border-neutral-200 bg-neutral-400 p-2 dark:border-neutral-400 dark:bg-neutral-700">
            <button
              className="flex items-center bg-neutral-400 px-2 py-1 outline-none hover:bg-neutral-500 dark:bg-neutral-700"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                buttonOnClickHandler("Normal");
              }}
            >
              <span>
                <ParagraphIcon className="mr-2 h-4 w-4" />
              </span>
              <span className="text-sm">Normal</span>
            </button>
            <button
              className="flex items-center bg-neutral-400 px-2 py-1 outline-none hover:bg-neutral-500 dark:bg-neutral-700"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                buttonOnClickHandler("Large");
              }}
            >
              <span>
                <H1Icon fill="#ffffff" className="mr-2 h-5 w-5" />
              </span>
              <span className="text-sm">Large Heading</span>
            </button>
            <button
              className="flex items-center bg-neutral-400 px-2 py-1 outline-none hover:bg-neutral-500 dark:bg-neutral-700"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                buttonOnClickHandler("Small");
              }}
            >
              <span>
                <H2Icon fill="#ffffff" className="mr-2 h-5 w-5" />
              </span>
              <span className="text-sm">Small Heading</span>
            </button>
            <button
              className="flex items-center bg-neutral-400 px-2 py-1 outline-none hover:bg-neutral-500 dark:bg-neutral-700"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                buttonOnClickHandler("Ordered");
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
              }}
            >
              <span>
                <OLIcon fill="white" className="mr-2 flex h-5 w-5 fill-white" />
              </span>
              <span className="text-sm">Numbered List</span>
            </button>
            <button
              className="flex items-center bg-neutral-400 px-2 py-1 outline-none hover:bg-neutral-500 dark:bg-neutral-700"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                buttonOnClickHandler("Bulleted");
              }}
            >
              <span>
                <ULIcon fill="white" className="mr-2 h-5 w-5" />
              </span>
              <span className="text-sm">Bulleted List</span>
            </button>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default OptionsDropdown;

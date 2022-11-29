import * as vscode from "vscode";
import { TextDocument, Range, Position, TextEditor, Selection } from "vscode";
import { getExpandCodeList } from "./settings";

export function runEntireFile() {
  const textEditor = vscode.window.activeTextEditor;
  const document = textEditor?.document;
  const text = document?.getText();
  vscode.commands.executeCommand("jupyter.execSelectionInteractive", text);
}

export function runInferredCodeBlock(): void {
  const textEditor = vscode.window.activeTextEditor;
  console.log("textEditor", textEditor);
  if (!textEditor) {
    return;
  }

  const initialCursorPosition = textEditor?.selection.anchor;
  console.log("initialCursorPosition", initialCursorPosition);

  const expandedCodeRange = getExpandedCodeRegion(
    textEditor,
    initialCursorPosition
  );
  console.log("expandedCodeRange", expandedCodeRange);

  const text = textEditor.document.getText(expandedCodeRange);
  console.log("text", text);
  vscode.commands.executeCommand("jupyter.execSelectionInteractive", text);

  // TODO: move cursor to end of range
  const endPosition = new Position(expandedCodeRange.end.line + 1, 0);
  const newSelection = new Selection(endPosition, endPosition);
  textEditor.selections = [newSelection];
}

export function runInferredCodeBlockAndMoveDown(): void {
  runInferredCodeBlock();
}

function getExpandedCodeRegion(
  editor: TextEditor,
  initialPosition: Position
): Range {
  // Assuming that no text is selected
  const beginRange = new Range(initialPosition, initialPosition);
  console.log("beginRange", beginRange);

  const initialIndentText = getInitialIndentText(editor, initialPosition);
  console.log("initialIndentText", initialIndentText);

  const finalRange = expandRangeDownward(editor, beginRange, initialIndentText);
  console.log("finalRange", finalRange);
  return finalRange;
}

function getInitialIndentText(
  editor: TextEditor,
  initialPosition: Position
): string {
  const lineText = editor.document.lineAt(initialPosition.line).text;
  const indent = lineText.match(/^\s+/);
  return indent ? indent[0] : "";
}

/**
 * Expand range downwards
 *
 * @param editor  [editor description]
 * @param range   Starting Range
 * @param indent  Indentation of original line
 *
 * @return  {Range}               [return description]
 */
function expandRangeDownward(
  editor: TextEditor,
  currentRange: Range,
  indent: string
): Range {
  const document = editor.document;
  const expandCodeList = getExpandCodeList();
  // add whitespace to the list
  const expandCode = ["\\s"].concat(expandCodeList).join("|");
  const expandRegex = new RegExp(`^(${indent}(${expandCode})|\s*#|\s*$)`);

  let nextLineNum = currentRange.end.line;

  // expand code to the bottom
  while (
    nextLineNum <= editor.document.lineCount &&
    document.lineAt(nextLineNum).text.match(expandRegex)
  ) {
    nextLineNum += 1;
    console.log("adding a line number");
  }

  const endPosition = document.lineAt(nextLineNum + 1).range.end;
  return new Range(currentRange.start, endPosition);
}


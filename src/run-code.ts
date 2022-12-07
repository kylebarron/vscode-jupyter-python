import * as vscode from "vscode";
import { TextDocument, Range, Position, TextEditor, Selection } from "vscode";
import { getExpandCodeList } from "./settings";

export function runEntireFile() {
  const textEditor = vscode.window.activeTextEditor;
  const document = textEditor?.document;
  const text = document?.getText();
  vscode.commands.executeCommand("jupyter.execSelectionInteractive", text);
}

/**
 * Run an inferred code block in the IPython kernel
 */
export function runInferredCodeBlock(): void {
  const textEditor = vscode.window.activeTextEditor;
  if (!textEditor) {
    return;
  }

  _runInferredCodeBlock(textEditor);
}

export function runInferredCodeBlockAndMoveDown(): void {
  const textEditor = vscode.window.activeTextEditor;
  if (!textEditor) {
    return;
  }

  const expandedCodeRange = _runInferredCodeBlock(textEditor);

  const endPosition = new Position(expandedCodeRange.end.line + 1, 0);
  const newSelection = new Selection(endPosition, endPosition);
  setSelection(textEditor, newSelection);
}

/** Set selection in given text editor and scroll down */
function setSelection(textEditor: TextEditor, selection: Selection): void {
  textEditor.selections = [selection];
  textEditor.revealRange(selection);
}

function _runInferredCodeBlock(textEditor: TextEditor): Range {
  const initialCursorPosition = movePositionToStartOfLine(
    textEditor.selection.anchor
  );

  const expandedCodeRange = getExpandedCodeRegion(
    textEditor,
    initialCursorPosition
  );

  const text = textEditor.document.getText(expandedCodeRange);
  vscode.commands.executeCommand("jupyter.execSelectionInteractive", text);

  return expandedCodeRange;
}

function movePositionToStartOfLine(position: Position): Position {
  return position.with(undefined, 0);
}

function getExpandedCodeRegion(
  editor: TextEditor,
  initialPosition: Position
): Range {
  // Assuming that no text is selected
  // In practice, initialPosition here is the beginning of a line
  const beginRange = new Range(initialPosition, initialPosition);
  console.log("beginRange", beginRange);

  const initialIndentText = getInitialIndentTextAtLine(editor, initialPosition);
  console.log("initialIndentText", initialIndentText);

  const finalRange = expandRangeDownward(editor, beginRange, initialIndentText);
  console.log("finalRange", finalRange);
  return finalRange;
}

function getInitialIndentTextAtLine(
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

  const whitespaceOnlyRegex = new RegExp("^\\s*$");

  let nextLineNum = currentRange.end.line + 1;

  // expand code to the bottom
  while (
    nextLineNum < editor.document.lineCount &&
    (document.lineAt(nextLineNum).text.match(whitespaceOnlyRegex) ||
      document.lineAt(nextLineNum).text.match(expandRegex))
  ) {
    nextLineNum += 1;
    console.log("adding a line number:", nextLineNum);
  }

  console.log("nextLineNum", nextLineNum);

  const endPosition = document.lineAt(nextLineNum - 1).range.end;
  console.log("endPosition", endPosition);
  const endRange = new Range(currentRange.start, endPosition);
  console.log("endRange", endRange);
  return endRange;
}


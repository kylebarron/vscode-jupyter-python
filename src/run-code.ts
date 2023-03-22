import * as vscode from "vscode";
import { Range, Position, TextEditor, Selection } from "vscode";
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

  const expandedCodeRange = inferCodeBlock(textEditor);
  const inferredBlockText = textEditor.document.getText(expandedCodeRange);
  executeText(inferredBlockText);
}

export function runInferredCodeBlockAndMoveDown(): void {
    const textEditor = vscode.window.activeTextEditor;
    if (!textEditor) {
        return;
    }
    const expandedCodeRange = inferCodeBlock(textEditor);
    const inferredBlockText = textEditor.document.getText(expandedCodeRange);
    console.log("inferredBlockText", inferredBlockText);
    var empty_line_count = 0;
    for(var i = expandedCodeRange.end.line; i >= expandedCodeRange.start.line; i--){
        if(textEditor.document.lineAt(i).text.match(/^\s*$/)){
            empty_line_count += 1;
        }
        else{
            break;
        }
    }
    console.log("empty_line_count", empty_line_count);
    executeText(inferredBlockText);
    //add a new line to the end of the code block
    var endPosition;
    var newSelection;
    if(textEditor.document.lineCount <= expandedCodeRange.end.line + 1){
        console.log("the last block")
        if(expandedCodeRange.start.line == expandedCodeRange.end.line-empty_line_count){
            console.log("the last block is a single line")
            if(empty_line_count == 0){
                console.log("need to add a new line")
                vscode.commands.executeCommand("editor.action.insertLineAfter");
            }
            endPosition = new Position(expandedCodeRange.end.line + 1 - empty_line_count, 0);
            newSelection = new Selection(endPosition, endPosition);
            setSelectionAndMoveDown(textEditor, newSelection);
        }
        else{
            console.log("the last block is a multi-line block")
            endPosition = new Position(expandedCodeRange.end.line + 1 - empty_line_count, 0);
            newSelection = new Selection(endPosition, endPosition);
            setSelectionAndMoveDown(textEditor, newSelection);
            if(empty_line_count == 0){
                console.log("need to add a new line")
                endPosition = new Position(expandedCodeRange.end.line + 1, 0);
                newSelection = new Selection(endPosition, endPosition);
                vscode.commands.executeCommand("editor.action.insertLineAfter");
                setSelectionAndMoveDown(textEditor, newSelection);
            }
        }
    } 
    else {
        endPosition = new Position(expandedCodeRange.end.line + 1, 0);
        newSelection = new Selection(endPosition, endPosition);
        setSelectionAndMoveDown(textEditor, newSelection);
    }
}

function inferCodeBlock(textEditor: TextEditor): Range {
  const initialSelection = textEditor.selection;

  return initialSelection.isEmpty
    ? getExpandedCodeRegion(textEditor)
    : new Range(initialSelection.start, initialSelection.end);
}

/** Set selection in given text editor and scroll down */
function setSelectionAndMoveDown(
  textEditor: TextEditor,
  selection: Selection
): void {
  textEditor.selections = [selection];
  textEditor.revealRange(selection);
}

function executeText(text: string): void {
  vscode.commands.executeCommand("jupyter.execSelectionInteractive", text);
}

function movePositionToStartOfLine(position: Position): Position {
  return position.with(undefined, 0);
}

function getExpandedCodeRegion(editor: TextEditor): Range {
  // When inferring an expanded code range, always start at the beginning of a line
  const initialPosition = movePositionToStartOfLine(editor.selection.anchor);

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

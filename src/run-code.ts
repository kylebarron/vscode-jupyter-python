import * as vscode from "vscode";
import { TextDocument, Range, Position, TextEditor } from "vscode";

export function runEntireFile() {
  const textEditor = vscode.window.activeTextEditor;
  const document = textEditor?.document;
  const text = document?.getText();
  vscode.commands.executeCommand("jupyter.execSelectionInteractive", text);
}

export function runInferredCodeBlock() {
  const textEditor = vscode.window.activeTextEditor;
  if (!textEditor) {
    return;
  }

  const initialCursorPosition = textEditor?.selection.anchor;

  const expandedCodeRange = getExpandedCodeRegion(
    textEditor,
    initialCursorPosition
  );
  const text = textEditor.document.getText(expandedCodeRange);
  vscode.commands.executeCommand("jupyter.execSelectionInteractive", text);
}

function getExpandedCodeRegion(editor: TextEditor, position: Position): Range {
  // Assuming that no text is selected
  const selection = editor.selection;
  const beginPosition = selection.anchor;
  const document = editor.document;

  const lastLineNumber = document.lineCount;

  const cursorLineText = document.lineAt(beginPosition.line);
}


"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  runInferredCodeBlock,
  runInferredCodeBlockAndMoveDown,
} from "./run-code";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vscode-jupyter-python" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable1 = vscode.commands.registerCommand(
    "vscode-jupyter-python.run-inferred-block",
    async () => runInferredCodeBlock()
  );

  let disposable2 = vscode.commands.registerCommand(
    "vscode-jupyter-python.run-inferred-block-and-move-down",
    async () => runInferredCodeBlockAndMoveDown()
  );

  context.subscriptions.push(disposable1);
  context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {}

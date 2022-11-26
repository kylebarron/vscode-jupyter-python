"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { runEntireFile, runInferredCodeBlock } from "./run-code";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vscode-jupyter-python" is now active!'
  );

  const tmp = vscode.workspace.getConfiguration("vscode-jupyter-python");
  const expandCode = tmp.get("expandCode");


  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("vscode-jupyter-python.sayHello", async () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    // vscode.window.showInformationMessage(`Hello World ${expandCode} from vscode-jupyter-python!`);
    // await vscode.commands.executeCommand('jupyter.execSelectionInteractive', "print('sent to Interactive Window by package')\n");
    runInferredCodeBlock();
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

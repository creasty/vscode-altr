// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { computeTable, findInTable, Direction, Table } from "./table";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const cachedConfig: {
    table?: Table;
  } = {};

  function getTable(): Table {
    if (!cachedConfig.table) {
      const config = vscode.workspace.getConfiguration("altr");
      cachedConfig.table = computeTable(config);
    }
    return cachedConfig.table;
  }

  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration("altr.rules")) {
      cachedConfig.table = undefined;
    }
  }));

  context.subscriptions.push(vscode.commands.registerCommand(
    "altr.switchToNextFile",
    () => switchFile(getTable(), "forward")
  ));
  context.subscriptions.push(vscode.commands.registerCommand(
    "altr.switchToPreviousFile",
    () => switchFile(getTable(), "back")
  ));
}

// this method is called when your extension is deactivated
export function deactivate() {}

function switchFile(table: Table, direction: Direction) {
  const currentFilePath = getCurrentFilePath();
  if (!currentFilePath) {
    return;
  }

  findInTable(table, currentFilePath, direction)
    .then(uri => vscode.window.showTextDocument(uri))
    .catch(() =>
      vscode.window.showInformationMessage("No alternative file found")
    );
}

function getCurrentFilePath(): string | null {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return null;
  }
  if (editor.document.isUntitled) {
    return null;
  }

  const rootPath = vscode.workspace.rootPath;
  return editor.document.fileName
    .replace(/\\/g, "/")
    .replace(rootPath + "/", "");
}

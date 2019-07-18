// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getTable, findInTable, Direction } from './table';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    {
        const disposable = vscode.commands.registerCommand('altr.switchToNextFile', () => switchFile('forward'));
        context.subscriptions.push(disposable);
    }
    {
        const disposable = vscode.commands.registerCommand('altr.switchToPreviousFile', () => switchFile('back'));
        context.subscriptions.push(disposable);
    }
}

// this method is called when your extension is deactivated
export function deactivate() {}

function switchFile(direction: Direction) {
    const currentFilePath = getCurrentFilePath();
    if (!currentFilePath) {
        return;
    }

    const config = getConfig();
    const table = getTable(config);

    findInTable(table, currentFilePath, direction)
        .then(uri => vscode.window.showTextDocument(uri))
        .catch(() => vscode.window.showInformationMessage('No alternative file found'));
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
        .replace(/\\/g, '/')
        .replace(rootPath + '/', '');
}

function getConfig(): string[][] {
    return vscode.workspace.getConfiguration().get('altr.rules') || [];
}

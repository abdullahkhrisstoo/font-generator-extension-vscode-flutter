import * as vscode from 'vscode';
import generateFontSize from './font/font_size_generate';
import fontGenerater from './font/font_generate';



export function activate(context: vscode.ExtensionContext) {
  let generateFontSizeCommand = vscode.commands.registerCommand('extension.createFontFolder', () => { 
  generateFontSize();
  context.subscriptions.push(generateFontSizeCommand);
  
  let generateFontCommand = vscode.commands.registerCommand('extension.openFontGenerate', () => {
  fontGenerater();
    });
    context.subscriptions.push(generateFontCommand);
});

}
export function deactivate() {
}
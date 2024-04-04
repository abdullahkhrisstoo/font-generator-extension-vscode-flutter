"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
function activate(context) {
    let colorsCommand = vscode.commands.registerCommand('extension.colorsCommand', () => {
        const rootPath = vscode.workspace.rootPath; // Root path of the workspace
        if (!rootPath) {
            vscode.window.showErrorMessage('No workspace is opened.');
            return;
        }
        const coreFolderPath = path.join(rootPath, 'core');
        const extensionsFolderPath = path.join(coreFolderPath, 'extensions');
        const colorsFolderPath = path.join(coreFolderPath, 'colors');
        const colorExtensionFilePath = path.join(extensionsFolderPath, 'color_extensions.dart');
        const lightColorsFilePath = path.join(colorsFolderPath, 'light_colors.dart');
        const darkColorsFilePath = path.join(colorsFolderPath, 'dark_colors.dart');
        // Check if the core folder already exists
        if (fs.existsSync(coreFolderPath)) {
            vscode.window.showErrorMessage('The core folder already exists.');
            return;
        }
        // Create the core folder
        fs.mkdirSync(coreFolderPath);
        // Create the extensions folder
        fs.mkdirSync(extensionsFolderPath);
        // Create the color_extensions.dart file
        const colorExtensionsContent = `extension HexColor on Color {
  static Color fromHex(String hexColorString) {
    hexColorString = hexColorString.replaceAll("#", '');
    if (hexColorString.length == 6) {
      hexColorString = 'FF$hexColorString';
    }
    return Color(int.parse(hexColorString, radix: 16));
  }
}`;
        fs.writeFileSync(colorExtensionFilePath, colorExtensionsContent);
        // Create the colors folder
        fs.mkdirSync(colorsFolderPath);
        // Create the light_colors.dart file
        const lightColorsContent = `import 'package:flutter/material.dart';

class LightColors {
  static Color primaryColor = HexColor.fromHex('#6200EE');
  static Color primaryContainerColor = HexColor.fromHex('#EDE7F6');
  static Color onPrimaryColor = Colors.white;
  // Add the rest of the light colors here
}`;
        fs.writeFileSync(lightColorsFilePath, lightColorsContent);
        // Create the dark_colors.dart file
        const darkColorsContent = `import 'package:flutter/material.dart';

class DarkColors {
  static Color primaryColor = HexColor.fromHex('#3700B3');
  static Color primaryContainerColor = HexColor.fromHex('#0D47A1');
  static Color onPrimaryColor = Colors.white;
  // Add the rest of the dark colors here
}`;
        fs.writeFileSync(darkColorsFilePath, darkColorsContent);
        vscode.window.showInformationMessage('Colors command executed successfully!');
    });
    context.subscriptions.push(colorsCommand);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map
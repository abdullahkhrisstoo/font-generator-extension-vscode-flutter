import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'js-yaml';
interface FontWeight {
    name: string;
    weight: number;
  }
  
  function injectFonts(selectedFolder: string, assetsFolderPath: string) {
    const fontsFolderPath = path.join(assetsFolderPath, 'fonts');
  
    // Create the fonts folder if it doesn't exist
    fs.ensureDirSync(fontsFolderPath);
  
    const files = fs.readdirSync(selectedFolder);
  
    files.forEach((file) => {
      const filePath = path.join(selectedFolder, file);
      const stats = fs.statSync(filePath);
  
      if (stats.isFile() && file.endsWith('.ttf')) {
        const targetFilePath = path.join(fontsFolderPath, file);
  
        // Copy the file to the fonts folder
        fs.copySync(filePath, targetFilePath);
      }
    });
  }
  
  function updatePubspecYaml(fontFamily: string, fontWeights: FontWeight[]) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showErrorMessage('No workspace found.');
      return;
    }
  
    const projectPath = workspaceFolders[0].uri.fsPath;
    const pubspecPath = path.join(projectPath, 'pubspec.yaml');
  
    try {
      const pubspecContent = fs.readFileSync(pubspecPath, 'utf-8');
      const pubspecData = yaml.load(pubspecContent) as Record<string, any>;
  
      if (!pubspecData.flutter) {
        pubspecData.flutter = {};
      }
  
      if (!pubspecData.flutter.fonts) {
        pubspecData.flutter.fonts = [];
      }
  
      const fontEntry = {
        family: fontFamily,
        fonts: fontWeights.map((weight) => ({
          asset: `assets/fonts/${fontFamily}-${weight.name}.ttf`,
          weight: weight.weight,
        })),
      };
  
      pubspecData.flutter.fonts.push(fontEntry);
  
      const updatedPubspecContent = yaml.dump(pubspecData);
  
      fs.writeFileSync(pubspecPath, updatedPubspecContent, 'utf-8');
  
      // Generate fonts.dart file
      const coreFolderPath = path.join(projectPath, 'lib', 'core');
      const fontFolderPath = path.join(coreFolderPath, 'font');
  
      // Create the core folder if it doesn't exist
      fs.ensureDirSync(coreFolderPath);
  
      // Create the font folder if it doesn't exist
      fs.ensureDirSync(fontFolderPath);
  
      const fontsDartPath = path.join(fontFolderPath, 'fonts.dart');
      const fontWeightsString = fontWeights
        .map((weight) => `  static const FontWeight ${weight.name} = FontWeight.w${weight.weight};`)
        .join('\n');
  
      const fontsDartContent = `import 'package:flutter/material.dart';
  
  class Fonts {
    static const String family = '${fontFamily}';
  
  ${fontWeightsString}
  }
  `;
  
      fs.writeFileSync(fontsDartPath, fontsDartContent, 'utf-8');
  
      vscode.window.showInformationMessage('Fonts injected successfully, pubspec.yaml updated, and fonts.dart generated.');
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to update pubspec.yaml: ${error}`);
    }
  }
export default function fontGenerater(){
    const options: vscode.OpenDialogOptions = {
        canSelectMany: false,
        openLabel: 'Select Folder',
        canSelectFolders: true,
      };
  
      vscode.window.showOpenDialog(options).then((uri) => {
        if (uri && uri.length > 0) {
          const selectedFolder = uri[0].fsPath;
  
          const workspaceFolders = vscode.workspace.workspaceFolders;
          if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('No workspace found.');
            return;
          }
  
          const projectPath = workspaceFolders[0].uri.fsPath;
          const assetsFolderPath = path.join(projectPath, 'assets');
  
          // Create the assets folder if it doesn't exist
          fs.ensureDirSync(assetsFolderPath);
          injectFonts(selectedFolder, assetsFolderPath);
          // Determine font family name
          const fontFamily = path.basename(selectedFolder);
          const fontFiles = fs.readdirSync(selectedFolder);
          const fontWeights: FontWeight[] = [
            { name: 'thin', weight: 100 },
            { name: 'thinItalic', weight: 100 },
            { name: 'extraLight', weight: 200 },
            { name: 'extraLightItalic', weight: 200 },
            { name: 'light', weight: 300 },
            { name: 'lightItalic', weight: 300 },
            { name: 'regular', weight: 400 },
            { name: 'italic', weight: 400 },
            { name: 'medium', weight: 500 },
            { name: 'mediumItalic', weight: 500 },
            { name: 'semiBold', weight: 600 },
            { name: 'semiBoldItalic', weight: 600 },
            { name: 'bold', weight: 700 },
            { name: 'boldItalic', weight: 700 },
            { name: 'extraBold', weight: 800 },
            { name: 'extraBoldItalic', weight: 800 },
            { name: 'black', weight: 900 },
            { name: 'blackItalic', weight: 900 },
          ].filter((weight) => fontFiles.some((file) => file.toLowerCase().includes(weight.name.toLowerCase())));
          updatePubspecYaml(fontFamily, fontWeights);
        }
      });
}
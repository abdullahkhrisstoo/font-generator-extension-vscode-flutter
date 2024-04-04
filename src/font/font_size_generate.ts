import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';

function createFontFolderIfNotExists(coreFolderPath: string, fontFolderName: string) {
    const fontFolderPath = path.join(coreFolderPath, fontFolderName);
    if (!fs.existsSync(fontFolderPath)) {
      fs.mkdirSync(fontFolderPath);
    }
    }

function createFontSizeFile(fontFolderPath: string) {
    const fontSizeFilePath = path.join(fontFolderPath, 'font_size.dart');
    const fontSizeContent = 
    `import 'package:flutter/material.dart';
      class FontsSize {
      static final FontsSize _instance = FontsSize._internal();
    
      factory FontsSize() {
        return _instance;
      }
    
      FontsSize._internal() {
        _initialize();
      }
    
      static const double tabletDeviceIncrease = 6;
      static const double webDeviceIncrease = 9;
    
      static double s12 = _instance._getDeviceType(12.0);
      static double s14 = _instance._getDeviceType(14.0);
      static double s16 = _instance._getDeviceType(16.0);
      static double s18 = _instance._getDeviceType(18.0);
      static double s20 = _instance._getDeviceType(20.0);
      static double s22 = _instance._getDeviceType(22.0);
      static double s24 = _instance._getDeviceType(24.0);
      static double s26 = _instance._getDeviceType(26.0);
      static double s28 = _instance._getDeviceType(28.0);
      static double s30 = _instance._getDeviceType(30.0);
      static double s32 = _instance._getDeviceType(32.0);
      static double s36 = _instance._getDeviceType(36.0);
      static double s40 = _instance._getDeviceType(40.0);
      static double s44 = _instance._getDeviceType(44.0);
      static double s48 = _instance._getDeviceType(48.0);
      static double s52 = _instance._getDeviceType(52.0);
      static double s56 = _instance._getDeviceType(56.0);
      static double s60 = _instance._getDeviceType(60.0);
      static double s64 = _instance._getDeviceType(64.0);
      static double s72 = _instance._getDeviceType(72.0);
      static double s80 = _instance._getDeviceType(80.0);
      static double s96 = _instance._getDeviceType(96.0);
      double? _deviceType;
      MediaQueryData? _mediaQueryData;
    
      double _getDeviceType(double size) {
        _deviceType ??= _calculateDeviceType();
        return _deviceType! + size;
      }
    
      void _initialize() {
        _mediaQueryData = MediaQueryData.fromWindow(WidgetsBinding.instance.window);
      }
    
      double _calculateDeviceType() {
        final shortestSide = _mediaQueryData!.size.shortestSide;
    
        if (shortestSide < 600) {
          // Phone
          return 0.0;
        } else if (shortestSide < 900) {
          // Tablet
          return tabletDeviceIncrease;
        } else {
          // Website
          return webDeviceIncrease;
        }
      }
    } `;


    fs.writeFileSync(fontSizeFilePath, fontSizeContent);
    }

export default function generateFontSize(){
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showErrorMessage('No workspace found.');
      return;
    }

    const projectPath = workspaceFolders[0].uri.fsPath;
    const coreFolderPath = path.join(projectPath, 'lib', 'core');
    const fontFolderName = 'font';

    if (!fs.existsSync(coreFolderPath)) {
      fs.mkdirSync(coreFolderPath);
      createFontFolderIfNotExists(coreFolderPath, fontFolderName);
      createFontSizeFile(path.join(coreFolderPath, fontFolderName));
      vscode.window.showInformationMessage('Core folder and font folder created, and font_size.dart file injected.');
    } else {
      const fontFolderPath = path.join(coreFolderPath, fontFolderName);
      if (!fs.existsSync(fontFolderPath)) {
        createFontFolderIfNotExists(coreFolderPath, fontFolderName);
        createFontSizeFile(fontFolderPath);
        vscode.window.showInformationMessage('Font folder created inside core folder, and font_size.dart file injected.');
      } else {
        createFontSizeFile(fontFolderPath);
        vscode.window.showInformationMessage('Font folder already exists inside core folder, and font_size.dart file injected.');
      }
    }
}


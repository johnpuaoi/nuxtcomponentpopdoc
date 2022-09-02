import * as vscode from 'vscode';

const commentTemplate =
  '<!-- @PopDoc \n ### Component Name \n This is a short description of how to use the component. \n \n ### Props \n - example list of props \n \n ### Emits \n - example list of events \n \n ### Slots \n - example list of slots \n \n ### Examples \n ```vue \n<template>\n <div>Test</div> \n</template> \n ``` \n \n --> \n';

export const createPopDocComment = () => {
  return vscode.commands.registerCommand(
    'nuxtcomponentpopdoc.createPopDocComment',
    () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      // Check the current file is a vue file
      if (editor.document.languageId !== 'vue') {
        vscode.window.showErrorMessage(
          'Nuxt Component Pop Doc: Please open a vue file to use this command.'
        );
        return;
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);
      editor.edit((editBuilder) => {
        editBuilder.replace(selection, commentTemplate);
      });
    }
  );
};

// A function that watches current file and line for changes, if the user types <pd in the current line, trigger nuxtcomponentpopdoc.createPopDocComment
export const watchForPopDocCommentKeypress = () => {
  return vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    console.log('watchForPopDocComment');
    const document = editor.document;
    console.log('Doc: ', document);
    const selection = editor.selection;
    console.log('Selection: ', selection);
    const line = document.lineAt(selection.active.line);
    console.log('Line: ', line);
    const lineText = line.text;

    console.log('Line Text: ', lineText);
    if (lineText.includes('<pd')) {
      // Remove the <pd from the line, then trigger the command
      editor
        .edit((editBuilder) => {
          editBuilder.replace(line.range, '');
        })
        .then(() => {
          vscode.commands.executeCommand(
            'nuxtcomponentpopdoc.createPopDocComment'
          );
        });
    }
  });
};

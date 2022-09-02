import * as vscode from 'vscode';

// const commentTemplate =
//   '<!-- @PopDoc \n ### Component Name \n This is a short description of how to use the component. \n \n ### Props \n - example list of props \n \n ### Emits \n - example list of events \n \n ### Slots \n - example list of slots \n \n ### Examples \n ```vue \n<template>\n <div>Test</div> \n</template> \n ``` \n \n --> \n';

export const createPopDocComment = () => {
  return vscode.commands.registerCommand(
    'nuxtcomponentpopdoc.createPopDocComment',
    () => {
      // Retrieving settings here to ensure that changes to settings are reflected in the extension.
      // Get commentTemplate from settings
      const commentTemplate = vscode.workspace
        .getConfiguration('nuxtcomponentpopdoc')
        .get('commentTemplate') as string;

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
      editor
        .edit((editBuilder) => {
          editBuilder.replace(selection, commentTemplate);
        })
        .then(() => {
          // Select the text on line 2, starting at char 5 and ending at char 19
          const line2 = new vscode.Position(1, 5);
          const line2End = new vscode.Position(1, 19);

          // Create a new selection
          const newSelection = new vscode.Selection(line2, line2End);

          // And finally, set the new selection
          editor.selection = newSelection;
        });
    }
  );
};

// A function that watches current file and line for changes, if the user types <pd in the current line, trigger nuxtcomponentpopdoc.createPopDocComment
export const watchForPopDocCommentKeypress = () => {
  return vscode.workspace.onDidChangeTextDocument((event) => {
    // Retrieving settings here to ensure that changes to settings are reflected in the extension.
    // Get commentTemplate from settings
    const commentInsertKeys = vscode.workspace
      .getConfiguration('nuxtcomponentpopdoc')
      .get('commentInsertKeys') as string;

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
    if (lineText.includes(commentInsertKeys)) {
      // Remove the <pd from the line, then trigger the command
      editor
        .edit((editBuilder) => {
          // Replace just the <pd and not any other text on the line with nothing
          editBuilder.replace(
            new vscode.Range(
              new vscode.Position(selection.active.line, 0),
              new vscode.Position(selection.active.line, 3)
            ),
            ''
          );
        })
        .then(() => {
          vscode.commands.executeCommand(
            'nuxtcomponentpopdoc.createPopDocComment'
          );
        });
    }
  });
};

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Nuxt Pop Doc Activated');
  // Register new hover provider when hovering over javascript, typescript or html files.
  context.subscriptions.push(
    vscode.languages.registerHoverProvider([{ language: 'vue' }], {
      provideHover(document, position, token) {
        // Only get the word if the word sits between <> or </> tags.
        const wordRange = document.getWordRangeAtPosition(position, /<[^>]*>/);

        if (!wordRange) {
          return;
        }

        const word = document.getText(wordRange);

        if (!word) {
          return;
        } else {
          console.log('Word: ', word);
          // Remove anything else after the first space in the word.
          const wordWithoutSpace = word.split(' ')[0];
          // Remove < > / from word.
          const wordWithoutTags = wordWithoutSpace.replace(/<|>|\/|/g, '');

          console.log('Word without tags: ', wordWithoutTags);

          // : typeof import('../components/Auth/Login.vue')['default'];
          // JBadge: typeof import('../node_modules/@johnpuaoi/jptechcomponents/lib/components/Badge.vue')['default'];

          return vscode.workspace
            .findFiles('.nuxt/components.d.ts')
            .then((files) => {
              // Get the first file.
              const file = files[0];

              // Read the file.
              return vscode.workspace.openTextDocument(file).then((doc) => {
                // Find the word without tags in the doc and retrieve the line.
                const line = doc.lineAt(
                  doc.positionAt(doc.getText().indexOf(wordWithoutTags)).line
                );
                // Get the text of the line.
                const lineText = line.text;
                console.log('Line text: ', lineText);
                // Example of line text: JBadge: typeof import('../node_modules/@johnpuaoi/jptechcomponents/lib/components/Badge.vue')['default'];, so we need to get the path without the .. in the front and the )'['default'] at the end.
                const path = lineText
                  .split('import(')[1]
                  .split(')')[0]
                  .replace(/'|"/g, '')
                  .replace(/\.\./g, '');
                console.log('Path: ', path);

                // Remove ../ from path.
                const pathWithWildCards = path.replace('/', '**/');

                console.log('Path With Wildcards: ', pathWithWildCards);

                return vscode.workspace
                  .findFiles(pathWithWildCards)
                  .then((files) => {
                    // Get the first file
                    const file = files[0];
                    console.log('File: ', files[0]);
                    // Read the file.
                    return vscode.workspace
                      .openTextDocument(file)
                      .then((doc) => {
                        const text = doc.getText();
                        // if the text contains <!-- @PopDoc, add the text after it and before --> to the hover else return nothing.
                        if (text.includes('<!-- @PopDoc')) {
                          const popDocText = text
                            .split('<!-- @PopDoc')[1]
                            .split('-->')[0];

                          // Create vscode uri from file.
                          const uri = file;
                          // Add Uri to the beginning of popDocText

                          const popDocTextWithFilePath = `[Go To File](${uri}) ${popDocText}`;
                          console.log('PopDoc Text: ', popDocTextWithFilePath);
                          return new vscode.Hover(popDocTextWithFilePath);
                        }

                        return;
                      });
                  });
              });
            });
        }

        // end of provideHover
      },
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}

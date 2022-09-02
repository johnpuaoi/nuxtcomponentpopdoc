import * as vscode from 'vscode';

export const hoverProvider = () => {
  return vscode.languages.registerHoverProvider([{ language: 'vue' }], {
    provideHover(document, position, token) {
      // Only get the word if the word sits between <> or </> tags.
      const wordRange = document.getWordRangeAtPosition(position, /<[^>]*>/);

      // If the wordRange is null, then the word is not between <> or </> tags.
      if (!wordRange) {
        return;
      }

      // Get the word from the wordRange.
      const word = wordRange ? document.getText(wordRange) : null;

      // If the word is null, then return.
      if (!word) {
        return;
      }

      console.log('Word: ', word);
      // Remove anything else after the first space in the word.
      const wordWithoutSpace = word.split(' ')[0];
      // Remove < > / from word.
      const wordWithoutTags = wordWithoutSpace.replace(/<|>|\/|/g, '');

      console.log('Word without tags: ', wordWithoutTags);

      // : typeof import('../components/Auth/Login.vue')['default'];
      // JBadge: typeof import('../node_modules/@johnpuaoi/jptechcomponents/lib/components/Badge.vue')['default'];

      // .findFiles is not set in extension.ts so that new vers of components.d.ts can be used when it is updated.
      return vscode.workspace
        .findFiles('.nuxt/components.d.ts', '**/node_modules/**', 1)
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
              .findFiles(pathWithWildCards, null, 1)
              .then((files) => {
                // Get the first file
                const file = files[0];
                console.log('File: ', files[0]);
                // Read the file.
                return vscode.workspace.openTextDocument(file).then((doc) => {
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

      // end of provideHover
    },
  });
};

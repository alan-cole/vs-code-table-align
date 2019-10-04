import * as vscode from 'vscode';

function getLines (textEditor: vscode.TextEditor, ranges: Array<vscode.Range>) {
	if (ranges.length === 1) {
		if (ranges[0].isSingleLine && ranges[0].start.character === ranges[0].end.character) {
			// No Range selected
			return []
		}
	}

	return ranges.map(range => {
		const start = range.start.line;
		const end = range.end.line;
		const lines = [];
		for (let i = start; i <= end; i++) {
			lines.push(textEditor.document.lineAt(i));
		}
		return lines;
	}).reduce((prev, current) => {
		return prev.concat(current)
	});
}

function performTableAlignment (lines:vscode.TextLine[]) {
  const rowIndentation:number[] = []

  // Prep lines
  const finalRows:string[][] = []
  lines.forEach((row) => {
    rowIndentation.push(row.text.indexOf('|'))
    const preCols = row.text.trim().split('|')
    const cols:string[] = []
    preCols.forEach((testCol:string) => {
      if (testCol.length > 0) {
        cols.push(testCol.trim())
      }
    })
    finalRows.push(cols)
  })

  // Get column widths
  let colWidths:number[] = []
  finalRows.forEach(row => {
    row.forEach((col:string, colIdx:number) => {
      if (colWidths[colIdx] === undefined || (col.length > colWidths[colIdx])) {
        colWidths[colIdx] = col.length
      }
    })
  })

  // Apply col width
  finalRows.forEach(row => {
    for (let i = 0; i < row.length; i++) {
      row[i] = row[i] + ' '.repeat(colWidths[i] - row[i].length)
    }
  })

  // Assemble lines
  const finalLines:string[] = []
  finalRows.forEach((row, rowIdx) => {
    let line = ' '.repeat(rowIndentation[rowIdx])
    row.forEach((col:string, colIdx:number) => {
      line += (colIdx === 0 ? '|' : '') + ' ' + (col + ' |')
    })
    finalLines.push(line)
  })

  return finalLines;
}

export async function commandTableAlign(textEditor: vscode.TextEditor, ranges: Array<vscode.Range>) {
	const lines = getLines(textEditor, ranges);
	if (lines.length > 0) {
		const preparedLines = performTableAlignment(lines);
		// Replace lines
		textEditor.edit(editBuilder => {
			let lineIndex = 0;
			lines.forEach(line => {
				editBuilder.replace(line.range, preparedLines[lineIndex]);
				lineIndex++;
			});
		})
	} else {
		vscode.window.showInformationMessage('Alignment failed: No text range was selected.');
	}
}

// Controls for extension.
export function activate(context: vscode.ExtensionContext) {
	const command = vscode.commands.registerCommand('alan-cole.gherkinTableAlign', () => {
		if (vscode.window.activeTextEditor) {
			commandTableAlign(vscode.window.activeTextEditor, vscode.window.activeTextEditor.selections);
		}
	});
	context.subscriptions.push(command);
}

export function deactivate() {}

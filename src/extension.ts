import * as vscode from 'vscode';

class Scope {
  start:number = 0
  end:number = 0
}

class LineChange {
  range:vscode.Range
  text:string
  constructor (range:vscode.Range, text:string) {
    this.range = range
    this.text = text
  }
}

function getTableScopes(textEditor:vscode.TextEditor, lineFrom:number, lineTo:number) {
  const scopes:Scope[] = []
  let currentScope:Scope = new Scope()
  let isScopeOpen:boolean = false

  for (let i = lineFrom; i <= lineTo; i++) {
    const line = textEditor.document.lineAt(i)
    if (line.text.trim().indexOf('|') === 0) {
      // open the scope
      if (!isScopeOpen) {
        currentScope.start = i
        isScopeOpen = true
      }
    } else {
      // close the scope
      if (isScopeOpen) {
        currentScope.end = (i - 1)
        scopes.push(currentScope)
        currentScope = new Scope()
        isScopeOpen = false
      }
    }
  }
  // close the scope if it's open
  if (isScopeOpen) {
    currentScope.end = lineTo
    scopes.push(currentScope)
  }
  return scopes
}

function getScopes (textEditor:vscode.TextEditor, ranges:Array<vscode.Range>) {
  let scopes:Scope[]
  let noSelection:boolean = (ranges.length === 1 && ranges[0].isSingleLine && ranges[0].start.character === ranges[0].end.character)

  if (noSelection) {
    scopes = getTableScopes(textEditor, 0, textEditor.document.lineCount - 1)
  } else {
    scopes = []
    ranges.forEach(range => {
      const rangeScopes = getTableScopes(textEditor, range.start.line, range.end.line)
      scopes = scopes.concat(rangeScopes)
    })
  }
  return scopes
}

function performTableAlignment (lines:vscode.TextLine[]) {
  const rowIndentation:number[] = []

  // prep lines
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

  // get column widths
  let colWidths:number[] = []
  finalRows.forEach(row => {
    row.forEach((col:string, colIdx:number) => {
      if (colWidths[colIdx] === undefined || (col.length > colWidths[colIdx])) {
        colWidths[colIdx] = col.length
      }
    })
  })

  // apply col width
  finalRows.forEach(row => {
    for (let i = 0; i < row.length; i++) {
      row[i] = row[i] + ' '.repeat(colWidths[i] - row[i].length)
    }
  })

  // assemble lines
  const finalLines:string[] = []
  finalRows.forEach((row, rowIdx) => {
    let line = ' '.repeat(rowIndentation[rowIdx])
    row.forEach((col:string, colIdx:number) => {
      line += (colIdx === 0 ? '|' : '') + ' ' + (col + ' |')
    })
    finalLines.push(line)
  })

  return finalLines
}

export async function commandTableAlign(textEditor:vscode.TextEditor, ranges:Array<vscode.Range>) {
  const lineChanges:LineChange[] = []
  const scopes:Scope[] = getScopes(textEditor, ranges)

  scopes.forEach(scope => {
    // get scope lines
		const lines:vscode.TextLine[] = []
		for (let i = scope.start; i <= scope.end; i++) {
			lines.push(textEditor.document.lineAt(i))
    }
    // align scope lines
    if (lines.length > 0) {
      const preparedLines:string[] = performTableAlignment(lines)
      lines.forEach((line, lineIndex) => {
        lineChanges.push(new LineChange(line.range, preparedLines[lineIndex]))
      })
    }
  })

  // replace editor lines with alignments
  if (lineChanges.length > 0) {
    textEditor.edit(editBuilder => {
      let lineIndex = 0
      lineChanges.forEach((change:LineChange) => {
        editBuilder.replace(change.range, change.text)
        lineIndex++
      })
    })
  } else {
    vscode.window.showInformationMessage('Alignment failed: No tables were found.');
  }
}

// controls for extension
export function activate(context:vscode.ExtensionContext) {
	const command = vscode.commands.registerCommand('alan-cole.gherkinTableAlign', () => {
		if (vscode.window.activeTextEditor) {
			commandTableAlign(vscode.window.activeTextEditor, vscode.window.activeTextEditor.selections)
		}
	})
	context.subscriptions.push(command)
}

export function deactivate() {}

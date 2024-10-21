import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as extension from '../extension';

suite('Extension Test Suite', () => {
  // -------------------------------------------------------------------------------------------
  test('Align - Single table', () => {
    const lines = [
      '| first column | 2nd column |',
      '| row A | This is my first row |',
    ];
    const expected = [
      '| first column | 2nd column           |',
      '| row A        | This is my first row |',
    ].join('\n');
    assert.strictEqual(extension.performTableAlignment(lines).join('\n'), expected);
  });

  // -------------------------------------------------------------------------------------------
  test('Align - Single table with empty rows', () => {
    const lines = [
      '| first column | 2nd column |',
      '| row A | This is my first row |',
      '',
      '',
      '| row A | This is my third and final row |',
    ];
    const expected = [
      '| first column | 2nd column                     |',
      '| row A        | This is my first row           |',
      '',
      '',
      '| row A        | This is my third and final row |',
    ].join('\n');
    assert.strictEqual(extension.performTableAlignment(lines).join('\n'), expected);
  });

  // -------------------------------------------------------------------------------------------
  test('Align - No changes', () => {
    const lines = [
      '| first column | 2nd column                     |',
      '| row A        | This is my first row           |',
      '',
      '',
      '| row A        | This is my third and final row |',
    ];
    const expected = [
      '| first column | 2nd column                     |',
      '| row A        | This is my first row           |',
      '',
      '',
      '| row A        | This is my third and final row |',
    ].join('\n');
    assert.strictEqual(extension.performTableAlignment(lines).join('\n'), expected);
  });

  // -------------------------------------------------------------------------------------------
  test('Align - Trim extra column space', () => {
    const lines = [
      '|    first column       | 2nd column                      |',
      '|  row A         | This is my first row           |',
    ];
    const expected = [
      '| first column | 2nd column           |',
      '| row A        | This is my first row |',
    ].join('\n');
    assert.strictEqual(extension.performTableAlignment(lines).join('\n'), expected);
  });

  // -------------------------------------------------------------------------------------------
  test('Align - Keep indentation', () => {
    const lines = [
    '  | name  | birthplace | age |',
    '  | Jonathan | Stockholm | 24 |',
    '  | Luke | London | 8 |',
    '  | Jamie | Melbourne | 50 |',
    ];
    const expected = [
    '  | name     | birthplace | age |',
    '  | Jonathan | Stockholm  | 24  |',
    '  | Luke     | London     | 8   |',
    '  | Jamie    | Melbourne  | 50  |',
    ].join('\n');
    assert.strictEqual(extension.performTableAlignment(lines).join('\n'), expected);
  });
});

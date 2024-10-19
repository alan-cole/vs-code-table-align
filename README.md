# Gherkin Table Align

A table formatter for [gherkin data tables](https://cucumber.io/docs/gherkin/reference/#data-tables).

## Features

* Run on document without selection to find and align all tables.
* Select a section of text to align tables within that selection.

Given a Gherkin style table, you can turn this:

```gherkin
Given the following users exist:
  | name  | birthplace | age |
  | Jonathan | Stockholm | 24 |
  | Luke | London | 8 |
  | Jamie | Melbourne | 50 |

Given the following administrators exist:
  | name  | birthplace | identification |
  | Sean | Glasgow  | 0001 |
  | Glenn | Dublin | 0002 |
  | Ian | Amsterdam | 0003 |
  | Bonnie | Budapest | 0004 |
```

into this:

```gherkin
Given the following users exist:
  | name     | birthplace | age |
  | Jonathan | Stockholm  | 24  |
  | Luke     | London     | 8   |
  | Jamie    | Melbourne  | 50  |

Given the following administrators exist:
  | name   | birthplace | identification |
  | Sean   | Glasgow    | 0001           |
  | Glenn  | Dublin     | 0002           |
  | Ian    | Amsterdam  | 0003           |
  | Bonnie | Budapest   | 0004           |
```

## How to use

Run from the command palette by searching `Gherkin Table Align`, or set your own shortcut in File > Preferences > Keyboard Shortcuts.

## Known Issues

* Expects table rows to be on their own line. Will not format correctly if any text exists before the first "|".

## Release Notes

## 1.1.0

* Added option "Allow empty rows in tables."
* Updated dependencies.

### 1.0.1

* Updated readme.

### 1.0.0

* Each table is now aligned separately.
* Format all tables on document if nothing is selected.
* Format table, even if selection includes non-table lines.
* New icon.

### 0.0.3

* Naming update.
* Readme.

### 0.0.2

* Keep line indentation before the first "|".

### 0.0.1

* Initial release

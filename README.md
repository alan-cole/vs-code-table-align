# Table Align

A table formatter for [gherkin data tables](https://cucumber.io/docs/gherkin/reference/#data-tables).

## Features

Given a Gherkin style table, you can turn this:

```gherkin
Given the following users exist:
  | name  | birthplace | age |
  | Jonathan | Stockholm | 24 |
  | Luke | London | 8 |
  | Jamie | Melbourne | 50 |
```

into this:

```gherkin
Given the following users exist:
  | name     | birthplace | age |
  | Jonathan | Stockholm  | 24  |
  | Luke     | London     | 8   |
  | Jamie    | Melbourne  | 50  |
```

## Known Issues

- Expects table rows to be on their own line. Will not format correctly if any text exists before the first "|".

## Release Notes

- 0.0.3 - Naming update. Readme.
- 0.0.2 - Keep line indentation before the first "|".
- 0.0.1 - Initial release

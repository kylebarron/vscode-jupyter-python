# vscode-jupyter-python README

Run automatically-inferred Python code blocks in Jupyter.

In this example, the **only** keyboard shortcut used is <kbd>Cmd</kbd>+<kbd>Enter</kbd>:

https://user-images.githubusercontent.com/15164633/204446417-eb9b260b-d48f-4d00-b313-ec203d84988f.mov

This is inspired by the [Hydrogen](https://github.com/nteract/hydrogen) and [`hydrogen-python`](https://github.com/nikitakit/hydrogen-python) extensions for [Atom](https://github.com/atom/atom/).

## Features

- Infer a logical "block" of code to be run at once, without needing to manually mark cell boundaries with `# %%`.

  In general a "block" is the current line plus any following lines with a greater initial indentation.

  _Additionally_ there's a list of keywords where the "block" of code should be expanded, even when that code appears at the same indentation level. For example:

  ```py
  # cursor
  # ↓
    if x > 0:
      foo()
    else:
      bar()
  ```

  in this case a naive "include only code with greater indentation" would exclude the `else` clause, so `else` is included in the list of keywords where the code should be extended despite being at the initial indentation. See "extension settings" below for how to modify this list.

## Keyboard Shortcuts

By default there are two shortcuts defined:

- <kbd>Cmd</kbd>+<kbd>Enter</kbd>/<kbd>Ctrl</kbd>+<kbd>Enter</kbd>: Run an automatically-inferred code block but don't move the cursor.
- <kbd>Shift</kbd>+<kbd>Enter</kbd>: Run an automatically-inferred code block and move the cursor down to the start of the next code block.

## Requirements

This depends on the upstream [`vscode-jupyter`](https://github.com/microsoft/vscode-jupyter) extension, where this extension simply infers what text to send to `jupyter.execSelectionInteractive`.

## Extension Settings

- `vscode-jupyter-python.expandCodeList`: This list is used to determine when code that is part of the same indentation level as the starting text should be included in the inferred block. You may define your own custom elements to modify the code to your preferred behaviour. In the default setting, `else`, `elif`, `except`, `finally`, as well as all closing braces are expanded on.

## Known Issues

This is an early package so there are probably bugs.

- [ ] Support for extending block upwards (i.e. if a decorator is on the previous line, include it in the current selection)

## Release Notes

## 0.1.0 - 2022-11-28

Initial release.

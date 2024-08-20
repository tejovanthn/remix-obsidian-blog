---
tags:
  - dev-work
  - macos
  - logseq
sections:
  - tech
date: 2024-05-31
type: post
---
# [[Recursively search and replace text in all files in MacOS]]

## Steps

`find` files based on file extension

use `-print0` to terminate strings with null strings, instead of newline characters

This allows proper interpretation of strings with spaces

plays well with `xargs -0`

`xargs` and `sed` to replace with a regex string

use `-0` to look though lists separated by null strings

use `-i ""` to ignore these null strings

## Example

```bash
find . -name '*.txt' -print0 | xargs -0 sed -i "" "s/form/forms/g"
```

## Use case

While migrating [Roam](https://www.tejovanthn.com/pages/Roam) to [LogSeq](https://www.tejovanthn.com/pages/LogSeq) , I had to replace all `::` with `:` , which roam uses as a shortcut page with different formatting, and which is unsupported on LogSeq.

```bash
find . -name '*.md' -print0 | xargs -0 sed -i "" "s/::/:/g"
```

The above command made it super easy

## Source

[https://stackoverflow.com/a/17308739/1782471](https://stackoverflow.com/a/17308739/1782471)
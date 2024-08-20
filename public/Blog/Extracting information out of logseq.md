---
tags:
  - dev-work
  - logseq
sections:
  - tech
date: 2024-05-31
type: post
---
# [[Extracting information out of logseq]]

## Steps

Make a backup of the repo

Use `gawk` to extract the section you need. `-i inplace` will update the file it's working on

```zsh
gawk -i inplace -f extract.awk journals/*
```

```zsh
BEGIN {
    true = 1
    false = 0
    printLine = false
}

{
    if ($0 ~ /^- \[\[{HEADER}\]\]:/) {
        printLine = true
    } else if ($0 ~ /^-[:space:]*/) {
        printLine = false
    }
 
    if (printLine) print $0
}
```

`find` and delete all zero-byte files

```zsh
find journals/* -size 0 -print -delete
```

Update `assets` folder to include only the assets your new files need

Find all assets you're using, and delete the ones you're not

```zsh
grep "\.\.\/assets\/.*)" journals/* -oh | awk '{print substr($0, 11, length($0)-11)}'
```

```zsh
cd assets
setopt EXTENDED_GLOB
rm -- ^(X|Y|Z)
```

## Usecase

I wanted to extract my daily work interactions from my journal that I record under a page `Work/Pepper Content`

The `awk` script made it easy to extract things
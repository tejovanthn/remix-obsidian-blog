---
tags:
  - dev-work
sections:
  - tech
date: 2024-05-31
type: post
---
# Copy all Repos from Github

## Steps

[Github](https://www.tejovanthn.com/pages/Github) has API that you can use

`grep` the `full_name` field to get a list of all the repos

`cut` the relevant details to extract a neat list

Use `xargs` with substitution to clone the repos

```bash
curl "https://api.github.com/{user|orgs}/{username|orgname}/repos?page=1&per_page=100" \
-H "Accept: application/vnd.github.v3+json" \
-H"Authorization: token YOUR_TOKEN"  \
| grep -e 'full_name' \
| cut -d \" -f 4 \
| xargs -L1 -I{} git clone git@github.com:{}
```

## Usecase

I wanted explore all my repos hosted on [Github](https://www.tejovanthn.com/pages/Github) on my local machine instead.

The above command made it easy to dump the repos on my local machine
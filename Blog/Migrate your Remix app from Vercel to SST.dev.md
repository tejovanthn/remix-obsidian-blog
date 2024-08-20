---
tags:
  - dev-work
  - remix
  - sst
sections:
  - tech
date: 2024-05-31
type: post
---
# [[Migrate your Remix app from Vercel to SST.dev]]


## Process

### Install SST

Run the `init` function to install SST in the folder, and install the dependencies
```shell
sst init
```


### Update `package.json`

Make sure your dev server is bound properly in your `package.json` scripts block.
```json
"dev": "sst dev remix vite:dev",
```


### Run the dev server

Run the dev server to check everything works. It should.
```shell
pnpm run dev
```

### Update imports

Search your files for `vercel`.

I found imports in some of the files, and updated them:
```diff
- import type { MetaFunction } from "@vercel/remix";
+ import { MetaFunction } from "@remix-run/node";
```

Updated this line in the `tsconfig.json`
```diff
- "types": ["@vercel/remix", "node", "vite/client"],
+ "types": ["@remix-run/node", "vite/client"],
```

Updated this line in `vite.config.ts`
```diff
- plugins: [remix({ presets: [vercelPreset()] }), tsconfigPaths()],
+ plugins: [remix(), tsconfigPaths()],
```

Removed this line, and the component from the `root.tsx` file
```diff
- import { Analytics } from "@vercel/analytics/react";
```

Removed these lines from `package.json`
```diff
- "@vercel/analytics": "^1.2.2",
- "@vercel/remix": "^2.8.1",
```

### Check and deploy

Check if the dev server is working as expected. 
Commit your changes.
Deploy locally with `sst deploy`. It should assign a random looking cloudfront url. Check your logs for this url. 

### Remove Vercel Project

The slightly-scary part.
Go to your vercel dashboard, and remove the project. It will ask you to confirm a couple of times.

### Change your NS provider

Go to Route53 on your AWS console.

Create a new hosted zone.
1. Add your domain name
2. Copy the nameserver and SOA strings to your DNS. (this depends on where you've registered your website)
3. Remove the vercel settings from your DNS.
4. Copy the `hostedZoneId` string.

Update your `sst.config.ts` to reflect the custom domain. 
```typescript
    new sst.aws.Remix("ProjectWeb", {
      domain: {
        domainName: "example.com",
        redirects: ["www.example.com"],
        hostedZoneId: "<ID you copied from Route53>"
      }      
    });
```


### Deploy

Deploy with this command
```shell
sst deploy --stage production
```


### Automate deployments

I suggest using github pipelines for the moment for automating deployments. 
#### Once seed.run supports ion

Go to [seed.run](https://console.seed.run/), and set up your project. Follow their guide to get started.

Trigger a deployment.

Watch the build process. There should be no issues, if everything has been configured properly.
import { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
  useRouteLoaderData,
} from '@remix-run/react';
import clsx from 'clsx';
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from 'remix-themes';

import { Footer } from './components/footer';
import { Header } from './components/header';
import styles from './globals.css?url';
import { themeSessionResolver } from './sessions.server';
import { getPages } from './utils/blog.server';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  {
    rel: 'stylesheet',
    href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css',
  },
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon-16x16.png',
  },
  { rel: 'manifest', href: '/manifest.json' },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const pages = await getPages();
  const { getTheme } = await themeSessionResolver(request);
  const theme = getTheme();
  return json({ pages, theme });
}

function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data?.theme)} />
        <Links />
      </head>
      <body>
        <Header />
        <main className="container min-h-[calc(100vh-10rem)]">{children}</main>
        <Footer pages={data.pages} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider
      specifiedTheme={data?.theme || null}
      themeAction="/action/set-theme"
    >
      <Layout>
        <Outlet />
      </Layout>
    </ThemeProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const data = useRouteLoaderData<typeof loader>('root');

  return (
    <ThemeProvider
      specifiedTheme={data?.theme || null}
      themeAction="/action/set-theme"
    >
      <Layout>
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">
            {isRouteErrorResponse(error)
              ? `${error.status} ${error.statusText}`
              : error instanceof Error
                ? error.message
                : 'Unknown Error'}
          </h1>
          <Link to="/">Go back to home</Link>
        </div>
      </Layout>
    </ThemeProvider>
  );
}

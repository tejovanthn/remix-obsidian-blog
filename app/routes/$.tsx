import { LoaderFunction, json } from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';
import type { SitemapFunction } from 'remix-sitemap';
import { serverOnly$ } from 'vite-env-only/macros';
import {
  getEarmarksAndPosts,
  getPage,
  getPages,
  getPostsByEarmark,
  getRedirects,
} from '~/utils/blog.server';

export const sitemap: SitemapFunction = serverOnly$(async () => {
  const list: { loc: string }[] = [];
  const pages = await getPages();

  pages.forEach(({ frontmatter }) => {
    list.push({
      loc: `/${frontmatter.slug}`,
    });
  });

  return list;
});

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const pathname = url.pathname.slice(1);
  const redirects = await getRedirects();
  const redirectPage = redirects.find((r) => r?.frontmatter?.slug === pathname);
  if (redirectPage) {
    return redirect(redirectPage.frontmatter.to);
  }

  const pages = await getPages();
  const page = pages.find((p) => p?.frontmatter?.slug === pathname);

  if (['tags', 'sections', 'cards'].includes(pathname)) {
    const earmarks = await getEarmarksAndPosts(pathname);
    const pageContent = await getPage(page.frontmatter.slug);
    return json({ earmarks, page: pageContent });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [earmark, slug, ...rest] = pathname.split('/');
  if (['tags', 'sections', 'cards'].includes(earmark) && slug) {
    const earmarks = [
      { name: slug, slug, posts: await getPostsByEarmark(earmark, slug) },
    ];
    const pageContent = await getPage(slug);
    return json({ earmarks, page: pageContent });
  }

  if (page) {
    const pageContent = await getPage(page.frontmatter.slug);
    return json({ page: pageContent });
  }

  throw new Response('Page not found', { status: 404 });
};

const Earmarks = ({ earmarks }) => {
  if (!earmarks) return null;
  console.log(earmarks);
  return (
    <div className="prose dark:prose-invert mx-auto">
      {earmarks.map((earmark) => (
        <div key={earmark.slug}>
          <h2>
            {earmark.name} ({earmark.posts.length})
          </h2>
          <ul>
            {earmark.posts.map((post) => (
              <li key={post.frontmatter.slug}>
                <a href={`/post/${post.frontmatter.slug}`}>
                  {post.frontmatter.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default function BlogPost() {
  const { page, earmarks } = useLoaderData<typeof loader>();
  return (
    <>
      {page && page.content ? (
        <article
          className="prose dark:prose-invert mx-auto"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : null}
      <Earmarks earmarks={earmarks} />
    </>
  );
}

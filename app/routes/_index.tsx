import { LoaderFunction, json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import type { SitemapFunction } from 'remix-sitemap';
import { serverOnly$ } from 'vite-env-only/macros';
import { getBlogPosts } from '~/utils/blog.server';

export const sitemap: SitemapFunction = serverOnly$(async () => {
  const list: { loc: string }[] = [];
  const pages = await getBlogPosts();

  pages.forEach(({ frontmatter }) => {
    list.push({
      loc: `/post/${frontmatter.slug}`,
    });
  });

  return list;
});

export const loader: LoaderFunction = async () => {
  const posts = await getBlogPosts();
  return json({ posts });
};

export default function BlogIndex() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="prose dark:prose-invert mx-auto">
      <h1>Blog Posts</h1>
      <ul>
        {(posts || []).map(({ frontmatter }) => (
          <li key={frontmatter.slug}>
            <Link to={`/post/${frontmatter.slug}`}>{frontmatter.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

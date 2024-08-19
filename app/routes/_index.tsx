import { LoaderFunction, json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getBlogPosts } from '~/utils/blog.server';

type LoaderData = {
  posts: Awaited<ReturnType<typeof getBlogPosts>>;
};

export const loader: LoaderFunction = async () => {
  const posts = await getBlogPosts();
  return json({ posts });
};

export default function BlogIndex() {
  const { posts } = useLoaderData<LoaderData>();

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

import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getPage } from '~/utils/blog.server';

export const loader = async ({ params }) => {
  const page = await getPage(params.slug);
  return json({ page });
};

export default function BlogPost() {
  const { page } = useLoaderData<typeof loader>();

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <>
      <article
        className="prose dark:prose-invert mx-auto"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
      <script dangerouslySetInnerHTML={{ __html: `hljs.highlightAll()` }} />
    </>
  );
}

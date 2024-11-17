import { useLoaderData } from '@remix-run/react';
import { Tags } from '~/components/tags';
import { getPage } from '~/utils/blog.server';

export const loader = async ({ params }) => {
  const page = await getPage(params.slug);
  if (!page) throw new Response('Page not found', { status: 404 });
  return Response.json({ page });
};

export default function BlogPost() {
  const { page } = useLoaderData<typeof loader>();

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <>
      <Tags tags={page.frontmatter.tags} sections={page.frontmatter.sections} />
      <article
        className="prose dark:prose-invert mx-auto"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
      <script dangerouslySetInnerHTML={{ __html: `hljs.highlightAll()` }} />
    </>
  );
}

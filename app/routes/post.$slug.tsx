import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getPage } from '~/utils/blog.server';

type LoaderData = {
  page: Awaited<ReturnType<typeof getPage>>;
};

export const loader = async ({ params }) => {
  const page = await getPage(params.slug);
  return json({ page });
};

export default function BlogPost() {
  const { page } = useLoaderData<LoaderData>();

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <>
      <article dangerouslySetInnerHTML={{ __html: page.content }} />
      <script dangerouslySetInnerHTML={{ __html: `hljs.highlightAll()` }} />
    </>
  );
}

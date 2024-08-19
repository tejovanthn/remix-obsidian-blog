import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Badge } from '~/components/ui/badge';
import { getPage } from '~/utils/blog.server';

export const loader = async ({ params }) => {
  const page = await getPage(params.slug);
  return json({ page });
};

const Tags = ({ tags }: { tags: string[] }) => {
  if (!tags) return null;
  return (
    <div className="mx-auto max-w-prose py-2 flex flex-row space-x-2">
      {tags.map((tag) => (
        <Badge key={tag} variant={'outline'}>
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default function BlogPost() {
  const { page } = useLoaderData<typeof loader>();

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <>
      <Tags tags={page.frontmatter.tags} />
      <article
        className="prose dark:prose-invert mx-auto"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
      <script dangerouslySetInnerHTML={{ __html: `hljs.highlightAll()` }} />
    </>
  );
}

import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Badge } from '~/components/ui/badge';
import { getPage } from '~/utils/blog.server';

export const loader = async ({ params }) => {
  const page = await getPage(params.slug);
  if (!page) throw new Response('Page not found', { status: 404 });
  return json({ page });
};

const Tags = ({ tags, sections }: { tags: string[]; sections: string[] }) => {
  if (!tags) return null;
  return (
    <div className="mx-auto max-w-prose py-2 flex flex-row space-x-2">
      {tags
        ? tags.map((tag) => (
            <a key={tag} href={`/tags/${tag}`}>
              <Badge variant={'outline'}>{tag}</Badge>
            </a>
          ))
        : null}
      {sections
        ? sections.map((section) => (
            <a key={section} href={`/sections/${section}`}>
              <Badge variant={'secondary'}>{section}</Badge>
            </a>
          ))
        : null}
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
      <Tags tags={page.frontmatter.tags} sections={page.frontmatter.sections} />
      <article
        className="prose dark:prose-invert mx-auto"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
      <script dangerouslySetInnerHTML={{ __html: `hljs.highlightAll()` }} />
    </>
  );
}

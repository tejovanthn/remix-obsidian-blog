import { Badge } from './ui/badge';

export const Tags = ({
  tags,
  sections,
}: {
  tags: string[];
  sections: string[];
}) => {
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

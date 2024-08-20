export function Footer({ pages }) {
  if (!pages) return null;
  return (
    <footer className="flex justify-center items-center py-4">
      <ul className="flex space-x-8 list-none">
        {pages.map((page) => (
          <li key={page.frontmatter.slug}>
            <a href={`/${page.frontmatter.slug}`} className="hover:underline">
              {page.frontmatter.title}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}

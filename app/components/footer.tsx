export function Footer({ pages }) {
  return (
    <footer>
      <ul>
        {pages.map((page) => (
          <li key={page.frontmatter.slug}>
            <a href={`/${page.frontmatter.slug}`}>{page.frontmatter.title}</a>
          </li>
        ))}
      </ul>
    </footer>
  );
}

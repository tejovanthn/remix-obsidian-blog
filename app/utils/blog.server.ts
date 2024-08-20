import fs from 'fs/promises';
import path from 'path';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import extractFrontmatter from 'remark-extract-frontmatter';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import wikiLinkPlugin from 'remark-wiki-link';
import { read } from 'to-vfile';
import { unified } from 'unified';
import { convert } from 'url-slug';
import { parse as parseYaml } from 'yaml';

const postsPath = path.join(process.cwd(), 'public', 'Blog')
  // process.env.NODE_ENV === 'production'
  //   ? path.join(process.cwd(), 'public', 'Blog')
  //   : path.join(process.cwd(), 'Blog');

const processor = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkGfm)
  .use(remarkFrontmatter, ['yaml', 'toml'])
  .use(wikiLinkPlugin)
  .use(remarkRehype)
  .use(rehypeHighlight)
  .use(rehypeSlug);

const frontmatter = unified()
  .use(remarkParse)
  .use(remarkStringify)
  .use(remarkFrontmatter, ['yaml', 'toml'])
  .use(extractFrontmatter, { yaml: parseYaml });

interface CommonFrontmatter {
  slug: string;
  title: string;
  filename: string;
}

interface PostFrontmatter extends CommonFrontmatter {
  type: 'post';
  tags?: string[];
  sections?: string[];
  cards?: string[];
  date?: Date | string;
}

interface RedirectFrontmatter extends CommonFrontmatter {
  type: 'redirect';
  to: string;
}

interface EarmarkFrontmatter<T> extends CommonFrontmatter {
  type: T;
}

type Frontmatter =
  | PostFrontmatter
  | RedirectFrontmatter
  | EarmarkFrontmatter<'tags' | 'sections' | 'cards'>;

const getPostList = async ({ type }: { type?: string }) => {
  const dir = await fs.readdir(postsPath);
  const posts = await Promise.all(
    dir.map(async (filename) => {
      if (!filename.endsWith('.mdx') && !filename.endsWith('.md')) return null;
      const vfile = await read(path.join(postsPath, filename));
      await frontmatter().process(vfile);

      return {
        frontmatter: {
          slug: convert(filename.replace(/\.md$/, ''), {
            camelCase: false,
          }),
          filename,
          title: filename.replace(/\.md$/, ''),
          ...vfile.data,
        } as unknown as Frontmatter,
      };
    }),
  );

  if (type) {
    return posts.filter(
      (post) => post && post.frontmatter && post.frontmatter.type === type,
    );
  }
  return posts.filter((post) => post && post.frontmatter);
};

export async function getBlogPosts() {
  return await getPostList({ type: 'post' });
}

export async function getPages() {
  return await getPostList({ type: 'page' });
}

export async function getRedirects() {
  return await getPostList({ type: 'redirect' });
}

export async function getPage(slug: string) {
  const posts = await getPostList({});
  const post = posts.find((post) => post.frontmatter.slug === slug);
  if (!post) return null;
  const vfile = await read(path.join(postsPath, post.frontmatter.filename));

  const reactResult = await processor().use(rehypeStringify).process(vfile);

  return {
    content: reactResult.value,
    frontmatter: post.frontmatter,
  };
}

export async function getAllEarmarks(earmark: string) {
  const posts = await getPostList({});
  const earmarks = posts
    .map((post) => post.frontmatter[earmark])
    .flat()
    .filter(Boolean);
  return [...new Set(earmarks)];
}

export async function getPostsByEarmark(earmark: string, mark: string) {
  const posts = await getPostList({});
  return posts.filter((post) => {
    return (
      post?.frontmatter &&
      post.frontmatter[earmark] &&
      post.frontmatter[earmark].includes(mark)
    );
  });
}

export async function getEarmarksAndPosts(earmark: string) {
  const earmarks = await getAllEarmarks(earmark);
  return (
    await Promise.all(
      earmarks.map(async (mark) => ({
        name: mark,
        slug: convert(mark, {
          camelCase: false,
        }),
        posts: await getPostsByEarmark(earmark, mark),
      })),
    )
  ).sort((a, b) => a.name.localeCompare(b.name));
}

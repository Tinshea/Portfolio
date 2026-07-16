import Markdoc, { type Node, type RenderableTreeNode } from "@markdoc/markdoc";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import { BlogPost, FeaturedMedia } from "@/types";

// Server-side reader over content/posts/*.json (managed via /keystatic).
const reader = createReader(process.cwd(), keystaticConfig);

// Mirrors the youtube content-component declared in keystatic.config.ts.
const markdocConfig = {
  tags: {
    youtube: {
      render: "YouTube",
      selfClosing: true,
      attributes: {
        url: { type: String },
        caption: { type: String },
      },
    },
  },
};

function hasContent(node: Node | undefined | null): boolean {
  return Boolean(node && node.children && node.children.length > 0);
}

/** Transforms a Markdoc AST into a serializable renderable tree (client-safe). */
function renderBody(node: Node | undefined | null): RenderableTreeNode | null {
  if (!hasContent(node)) return null;
  const tree = Markdoc.transform(node!, markdocConfig);
  // Strip class prototypes so the tree crosses the server/client boundary.
  return JSON.parse(JSON.stringify(tree));
}

export async function getBlogPosts(locale: string): Promise<BlogPost[]> {
  const isFr = locale === "fr";
  const [entries, projectEntries] = await Promise.all([
    reader.collections.posts.all(),
    reader.collections.projects.all(),
  ]);

  // Projects flagged "show in blog" surface in the list without duplicating
  // their content: the card links to the existing project page.
  const projectPosts: BlogPost[] = projectEntries
    .filter(({ entry }) => entry.blog?.showInBlog)
    .map(({ slug, entry }) => ({
      slug,
      title: entry.name,
      date: entry.blog.publishedAt ?? "",
      description:
        ((isFr
          ? entry.descriptionFr || entry.descriptionEn
          : entry.descriptionEn || entry.descriptionFr) ?? ""),
      body: null,
      media: [],
      projectSlug: slug,
    }));

  const posts = entries.map(({ slug, entry }) => {
    const media: FeaturedMedia[] = entry.media
      .map((item): FeaturedMedia => {
        if (item.discriminant === "image") {
          return {
            type: "image",
            src: item.value.image ?? "",
            caption: item.value.caption || undefined,
          };
        }
        return {
          type: item.discriminant,
          src: item.value.url ?? "",
          caption: item.value.caption || undefined,
        };
      })
      .filter((item) => item.src.length > 0);

    // Fall back to the other language so a half-filled entry still works.
    const frNode = entry.bodyFr?.node;
    const enNode = entry.bodyEn?.node;
    const bodyNode = isFr
      ? (hasContent(frNode) ? frNode : enNode)
      : (hasContent(enNode) ? enNode : frNode);

    return {
      slug,
      title: (isFr && entry.titleFr ? entry.titleFr : entry.title) ?? "",
      date: entry.publishedAt ?? "",
      description:
        ((isFr
          ? entry.descriptionFr || entry.descriptionEn
          : entry.descriptionEn || entry.descriptionFr) ?? ""),
      body: renderBody(bodyNode),
      media,
    };
  });

  return [...posts, ...projectPosts].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export async function getBlogPost(locale: string, slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts(locale);
  // Project entries are excluded: their canonical page is the project page.
  return posts.find((post) => post.slug === slug && !post.projectSlug);
}

export async function getBlogSlugs(): Promise<string[]> {
  const entries = await reader.collections.posts.all();
  return entries.map((entry) => entry.slug);
}

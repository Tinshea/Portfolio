import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import { BlogPost, FeaturedMedia } from "@/types";

// Server-side reader over content/posts/*.json (managed via /keystatic).
const reader = createReader(process.cwd(), keystaticConfig);

export async function getBlogPosts(locale: string): Promise<BlogPost[]> {
  const entries = await reader.collections.posts.all();
  const isFr = locale === "fr";

  return entries
    .sort((a, b) => (b.entry.publishedAt ?? "").localeCompare(a.entry.publishedAt ?? ""))
    .map(({ slug, entry }) => {
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
      const bodyFr = entry.bodyFr ?? "";
      const bodyEn = entry.bodyEn ?? "";
      return {
        slug,
        title: (isFr && entry.titleFr ? entry.titleFr : entry.title) ?? "",
        date: entry.publishedAt ?? "",
        description:
          ((isFr
            ? entry.descriptionFr || entry.descriptionEn
            : entry.descriptionEn || entry.descriptionFr) ?? ""),
        body: isFr ? bodyFr || bodyEn : bodyEn || bodyFr,
        media,
      };
    });
}

export async function getBlogPost(locale: string, slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts(locale);
  return posts.find((post) => post.slug === slug);
}

export async function getBlogSlugs(): Promise<string[]> {
  const entries = await reader.collections.posts.all();
  return entries.map((entry) => entry.slug);
}

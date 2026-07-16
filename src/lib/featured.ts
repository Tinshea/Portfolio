import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import { FeaturedItem, FeaturedMedia } from "@/types";

// Server-side reader over content/projects/*.json (managed via /keystatic).
const reader = createReader(process.cwd(), keystaticConfig);

export async function getFeaturedItems(locale: string): Promise<FeaturedItem[]> {
  const entries = await reader.collections.projects.all();
  const isFr = locale === "fr";

  return entries
    .sort((a, b) => (a.entry.order ?? 99) - (b.entry.order ?? 99))
    .map(({ slug, entry }) => {
      // Fall back to the other language so a half-filled entry still works.
      const bodyFr = entry.page.bodyFr ?? "";
      const bodyEn = entry.page.bodyEn ?? "";
      const body = (isFr ? bodyFr || bodyEn : bodyEn || bodyFr).trim();
      const hasPage = body.length > 0;

      const media: FeaturedMedia[] = entry.page.media
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

      return {
        name: entry.name,
        slug,
        description:
          ((isFr
            ? entry.descriptionFr || entry.descriptionEn
            : entry.descriptionEn || entry.descriptionFr) ?? ""),
        tags: entry.tags as string[],
        image: entry.cardImage ?? entry.cardImageUrl ?? undefined,
        link: entry.link ?? undefined,
        details: hasPage ? { body, media } : undefined,
      };
    });
}

export async function getFeaturedItem(locale: string, slug: string): Promise<FeaturedItem | undefined> {
  const items = await getFeaturedItems(locale);
  return items.find((item) => item.slug === slug && item.details);
}

export async function getCaseStudySlugs(): Promise<string[]> {
  const items = await getFeaturedItems("en");
  return items.filter((item) => item.details && item.slug).map((item) => item.slug!);
}

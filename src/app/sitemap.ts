import type { MetadataRoute } from "next";
import { locales } from "@/config";
import { FeaturedItem } from "@/types";
import enMessages from "../../messages/en.json";

const SITE_URL = "https://www.malekbouzarkouna.com";

// Mirrors src/config.ts's `pathnames`: the slug used per locale for each route.
const ROUTES: Record<string, Record<(typeof locales)[number], string>> = {
  home: { fr: "/", en: "/" },
  experiences: { fr: "/experiences", en: "/experiences" },
  projects: { fr: "/projets", en: "/projects" },
  blog: { fr: "/blog", en: "/blog" },
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = Object.entries(ROUTES).flatMap(([routeKey, byLocale]) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${byLocale[locale] === "/" ? "" : byLocale[locale]}`,
      changeFrequency: "monthly" as const,
      priority: routeKey === "home" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}${byLocale[l] === "/" ? "" : byLocale[l]}`])
        ),
      },
    }))
  );

  // Case-study pages: one per Featured.items entry that has details + slug.
  // Slugs are locale-invariant, so reading the EN catalogue is enough.
  const featuredItems = (enMessages.Featured?.items ?? []) as FeaturedItem[];
  const projectPath = (locale: string, slug: string) =>
    locale === "fr" ? `/fr/projets/${slug}` : `/en/projects/${slug}`;
  const projectEntries = featuredItems
    .filter((item) => item.details && item.slug)
    .flatMap((item) =>
      locales.map((locale) => ({
        url: `${SITE_URL}${projectPath(locale, item.slug!)}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}${projectPath(l, item.slug!)}`])
          ),
        },
      }))
    );

  return [...staticEntries, ...projectEntries];
}

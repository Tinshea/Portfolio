import type { MetadataRoute } from "next";
import { locales } from "@/config";

const SITE_URL = "https://www.malekbouzarkouna.com";

// Mirrors src/config.ts's `pathnames`: the slug used per locale for each route.
const ROUTES: Record<string, Record<(typeof locales)[number], string>> = {
  home: { fr: "/", en: "/" },
  experiences: { fr: "/experiences", en: "/experiences" },
  projects: { fr: "/projets", en: "/projects" },
  blog: { fr: "/blog", en: "/blog" },
};

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.entries(ROUTES).flatMap(([routeKey, byLocale]) =>
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
}

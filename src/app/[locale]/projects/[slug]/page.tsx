import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/config";
import user from "@/data/user.json";
import { FeaturedItem } from "@/types";
import enMessages from "../../../../../messages/en.json";
import ProjectDetailClient from "./ProjectDetailClient";

interface Params {
  params: { locale: string; slug: string };
}

// Only locale x slug combinations declared in Featured.items exist; anything
// else is a hard 404 (otherwise streaming would commit a 200 before
// notFound() runs).
export const dynamicParams = false;

export function generateStaticParams() {
  const items = (enMessages.Featured?.items ?? []) as FeaturedItem[];
  const slugs = items.filter((item) => item.details && item.slug).map((item) => item.slug!);
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

async function getItem(locale: string, slug: string): Promise<FeaturedItem | undefined> {
  const t = await getTranslations({ locale, namespace: "Featured" });
  const raw = t.raw("items");
  if (!Array.isArray(raw)) return undefined;
  return (raw as FeaturedItem[]).find((item) => item.slug === slug && item.details);
}

export async function generateMetadata({ params: { locale, slug } }: Params): Promise<Metadata> {
  const item = await getItem(locale, slug);
  if (!item) return {};

  const title = `${user.name} | ${item.name}`;
  const path = locale === "fr" ? `/projets/${slug}` : `/projects/${slug}`;

  return {
    title,
    description: item.description,
    keywords: [user.name, item.name, ...item.tags],
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { en: `/en/projects/${slug}`, fr: `/fr/projets/${slug}` },
    },
    openGraph: {
      title,
      description: item.description,
      url: `/${locale}${path}`,
      type: "article",
      images: [item.image ?? "/og-image.jpg"],
    },
  };
}

export default async function ProjectPage({ params: { locale, slug } }: Params) {
  unstable_setRequestLocale(locale);
  const item = await getItem(locale, slug);
  if (!item) notFound();

  return <ProjectDetailClient item={item} />;
}

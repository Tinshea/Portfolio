import type { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/config";
import user from "@/data/user.json";
import { getFeaturedItem, getCaseStudySlugs } from "@/lib/featured";
import ProjectDetailClient from "./ProjectDetailClient";

interface Params {
  params: { locale: string; slug: string };
}

// Only locale x slug combinations declared in the content collection exist;
// anything else is a hard 404 (otherwise streaming would commit a 200 before
// notFound() runs).
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params: { locale, slug } }: Params): Promise<Metadata> {
  const item = await getFeaturedItem(locale, slug);
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
  const item = await getFeaturedItem(locale, slug);
  if (!item) notFound();

  return <ProjectDetailClient item={item} />;
}

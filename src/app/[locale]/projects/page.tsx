import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import user from "@/data/user.json";
import ProjectsClient from "./ProjectsClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tCategory = await getTranslations({ locale, namespace: "Category" });
  const tSeo = await getTranslations({ locale, namespace: "Seo" });

  const title = `${user.name} | ${tCategory("projects")}`;
  const description = tSeo("projects");
  const path = locale === "fr" ? "/projets" : "/projects";

  return {
    title,
    description,
    keywords: [user.name, "projects", "portfolio"],
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { en: "/en/projects", fr: "/fr/projets" },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}${path}`,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}

export default async function Projects({ params }: { readonly params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectsClient />;
}

import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import user from "@/data/user.json";
import ProjectsClient from "./ProjectsClient";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
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

export default function Projects({ params: { locale } }: { readonly params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return <ProjectsClient />;
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import user from "@/data/user.json";
import { getExperiences, getFormations } from "@/lib/experiences";
import ExperiencesClient from "./ExperiencesClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tCategory = await getTranslations({ locale, namespace: "Category" });
  const tSeo = await getTranslations({ locale, namespace: "Seo" });

  const title = `${user.name} | ${tCategory("experiences")}`;
  const description = tSeo("experiences");

  return {
    title,
    description,
    keywords: [user.name, "experiences", "portfolio"],
    alternates: {
      canonical: `/${locale}/experiences`,
      languages: { en: "/en/experiences", fr: "/fr/experiences" },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/experiences`,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}

export default async function Experience({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [experiences, formations] = await Promise.all([
    getExperiences(locale),
    getFormations(locale),
  ]);
  return <ExperiencesClient experiences={experiences} formations={formations} />;
}

import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import user from "@/data/user.json";
import { getFeaturedItems } from "@/lib/featured";
import { getExperiences } from "@/lib/experiences";
import { getAbout } from "@/lib/about";
import HomeClient from "./HomeClient";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const tHome = await getTranslations({ locale, namespace: "HomePage" });
  const tSeo = await getTranslations({ locale, namespace: "Seo" });

  const title = `${user.name} | ${tHome("subtitle")}`;
  const description = tSeo("home");
  const url = `/${locale}`;

  return {
    title,
    description,
    keywords: [user.name, "portfolio", "projects", "experiences"],
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", fr: "/fr" },
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const [featuredItems, experiences, about] = await Promise.all([
    getFeaturedItems(locale),
    getExperiences(locale),
    getAbout(locale),
  ]);
  return (
    <HomeClient
      featuredItems={featuredItems}
      experiences={experiences}
      about={about}
      // Build-time check: adding RESEND_API_KEY on Vercel + redeploy enables
      // the form; without it the section keeps the plain mailto button.
      contactFormEnabled={Boolean(process.env.RESEND_API_KEY)}
    />
  );
}

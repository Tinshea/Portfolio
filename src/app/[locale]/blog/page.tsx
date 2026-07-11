import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import user from "@/data/user.json";
import BlogClient from "./BlogClient";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const tCategory = await getTranslations({ locale, namespace: "Category" });
  const tSeo = await getTranslations({ locale, namespace: "Seo" });

  const title = `${user.name} | ${tCategory("blog")}`;
  const description = tSeo("blog");

  return {
    title,
    description,
    keywords: [user.name, "blog", "posts"],
    openGraph: {
      title,
      description,
      url: `/${locale}/blog`,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}

export default function Blog() {
  return <BlogClient />;
}

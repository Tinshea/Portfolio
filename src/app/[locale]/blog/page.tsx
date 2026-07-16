import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import user from "@/data/user.json";
import { getBlogPosts } from "@/lib/blog";
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
    alternates: {
      canonical: `/${locale}/blog`,
      languages: { en: "/en/blog", fr: "/fr/blog" },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/blog`,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}

export default async function Blog({ params: { locale } }: { params: { locale: string } }) {
  const posts = await getBlogPosts(locale);
  return <BlogClient posts={posts} />;
}

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/config";
import user from "@/data/user.json";
import { getBlogPost, getBlogSlugs } from "@/lib/blog";
import BlogPostClient from "./BlogPostClient";

interface Params {
  params: Promise<{ locale: string; slug: string }>;
}

// Only slugs declared in the posts collection exist; anything else is a hard
// 404 (otherwise streaming would commit a 200 before notFound() runs).
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(locale, slug);
  if (!post) return {};

  const title = `${user.name} | ${post.title}`;

  return {
    title,
    description: post.description,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: { en: `/en/blog/${slug}`, fr: `/fr/blog/${slug}` },
    },
    openGraph: {
      title,
      description: post.description,
      url: `/${locale}/blog/${slug}`,
      type: "article",
      images: ["/og-image.jpg"],
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getBlogPost(locale, slug);
  if (!post) notFound();

  return <BlogPostClient post={post} />;
}

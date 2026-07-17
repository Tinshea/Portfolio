import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Providers from "@/contexts/Providers";
import { getResumePath } from "@/lib/resume";
import { locales, routing } from "@/config";
import user from "@/data/user.json";

// Pre-render every locale tree statically; pages opt in by calling
// unstable_setRequestLocale before using next-intl.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.malekbouzarkouna.com"),
  title: user.name,
  description: "Malek Bouzarkouna's portfolio, showcasing projects and experiences.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Required for statically generated routes (e.g. project pages).
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const resumeHref = await getResumePath(locale);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.name,
    url: "https://www.malekbouzarkouna.com",
    jobTitle: "Software Engineer",
    sameAs: [
      `https://github.com/${user.githubusername}`,
      `https://linkedin.com/in/${user.linkedinusername}`,
    ],
  };

  return (
    <html lang={locale}>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable}`}
        style={{ margin: "0" }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers locale={locale} messages={messages} resumeHref={resumeHref}>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

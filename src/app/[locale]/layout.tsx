import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { getMessages } from "next-intl/server";
import Providers from "@/contexts/Providers";
import { getResumePath } from "@/lib/resume";
import user from "@/data/user.json";

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
  params: { locale },
}: {
  readonly children: React.ReactNode;
  readonly params: { locale: string };
}) {
  const messages = await getMessages({ locale });

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
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers locale={locale} messages={messages} resumeHref={getResumePath(locale)}>
          {children}
        </Providers>
      </body>
    </html>
  );
}

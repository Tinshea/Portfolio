import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getMessages } from "next-intl/server";
import Providers from "@/contexts/Providers";
import user from "@/data/user.json";
import StarsBackground from '@/components/StarsBackground';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
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

  return (
    <html lang={locale}>
      <body className={inter.variable} style={{ margin: "0" }}>
        <Providers locale={locale} messages={messages}>
        <StarsBackground />
          {children}
        </Providers>
      </body>
    </html>
  );
}

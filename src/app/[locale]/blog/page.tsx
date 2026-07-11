"use client";

import NavBar from "@/components/navbar/NavBar";
import BlogPosts from "../../../components/BlogPosts";
import user from "@/data/user.json";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import Head from "next/head";

const posts = [
  {
    title: "Introduction à Next.js",
    date: "1er Août 2024",
    description: "Découvrez les bases de Next.js et comment il peut améliorer vos projets React.",
    link: "/posts/introduction-a-nextjs",
  },
  {
    title: "Les meilleures pratiques avec Material-UI",
    date: "15 Juillet 2024",
    description: "Apprenez à utiliser Material-UI pour créer des interfaces utilisateur modernes et réactives.",
    link: "/posts/meilleures-pratiques-material-ui",
  },
];

export default function Blog() {
  const t = useTranslations("Category");
  useEffect(() => {
    document.title = user.name + " | " + t("blog");
  }, []);
  const theme = useTheme();
  return (
    <>
      <Head>
        <title>Malek Bouzarkouna | Blog</title>
        <meta name="description" content="Blog posts by Malek Bouzarkouna." />
        <meta name="keywords" content="Malek Bouzarkouna, blog, posts" />
        <meta property="og:title" content="Malek Bouzarkouna | Blog" />
        <meta property="og:description" content="Blog posts by Malek Bouzarkouna." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.malekbouzarkouna.com/blog" />
        <meta property="og:image" content="https://www.malekbouzarkouna.com/og-image.jpg" />
      </Head>
      <NavBar alwaysShowTopNav={true} />
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: theme.spacing(8),
          position: "relative",
        }}
      >
        <BlogPosts posts={posts} />
      </Box>
    </>
  );

}

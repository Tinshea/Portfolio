"use client";

import NavBar from "@/components/navbar/NavBar";
import StarsBackground from "@/components/StarsBackground";
import BlogPosts from "@/components/BlogPosts";
import { useTranslations } from "next-intl";
import { Box, Typography, useTheme } from "@mui/material";
import { BlogPost } from "@/types";
import useIsMobile from "@/hooks/useIsMobile";

export default function BlogClient({ posts }: { readonly posts: BlogPost[] }) {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const t = useTranslations("Blog");
  const tCategory = useTranslations("Category");

  return (
    <>
      <StarsBackground />
      <NavBar alwaysShowTopNav={true} />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: theme.spacing(10),
          position: "relative",
          zIndex: 1,
          gap: theme.spacing(3),
        }}
      >
        <Typography
          variant="h1"
          color="text.primary"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.1rem",
            fontSize: isMobile ? "1.5rem" : "2rem",
            "@media (prefers-reduced-motion: no-preference)": {
              animation: "riseIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
            },
          }}
        >
          {tCategory("blog")}
        </Typography>
        {posts.length > 0 ? (
          <BlogPosts posts={posts} />
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ padding: theme.spacing(4), textAlign: "center" }}>
            {t("empty")}
          </Typography>
        )}
      </Box>
    </>
  );
}

"use client";

import NavBar from "@/components/navbar/NavBar";
import BlogPosts from "@/components/BlogPosts";
import { useTranslations } from "next-intl";
import { Box, useTheme } from "@mui/material";
import { BlogPost } from "@/types";

export default function BlogClient() {
  const theme = useTheme();
  const t = useTranslations("Blog");
  const posts = t.raw("posts") as BlogPost[];

  return (
    <>
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

"use client";

import React from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/Footer";
import ProjectMedia from "@/components/ProjectMedia";
import { BlogPost } from "@/types";
import useIsMobile from "@/hooks/useIsMobile";

const BlogPostClient: React.FC<{ post: BlogPost }> = ({ post }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const t = useTranslations("Blog");
  const locale = useLocale();

  const paragraphs = post.body.split(/\n\s*\n/).filter(Boolean);
  const formattedDate = post.date
    ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(post.date))
    : "";

  return (
    <>
      <NavBar alwaysShowTopNav={true} />
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          component="article"
          sx={{
            width: "100%",
            maxWidth: "860px",
            margin: "0 auto",
            padding: isMobile ? theme.spacing(3) : theme.spacing(4),
            paddingTop: theme.spacing(12),
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing(3),
            flexGrow: 1,
          }}
        >
          <Box>
            <Link href="/blog" passHref legacyBehavior>
              <Button component="a" startIcon={<ArrowBackIcon />} sx={{ marginLeft: -1 }}>
                {t("backToBlog")}
              </Button>
            </Link>
          </Box>

          <Typography
            variant="h1"
            color="text.primary"
            sx={{
              fontWeight: "bold",
              fontSize: isMobile ? "1.75rem" : "2.5rem",
              lineHeight: 1.2,
            }}
          >
            {post.title}
          </Typography>

          {formattedDate && (
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "var(--font-geist-mono), monospace" }}>
              {formattedDate}
            </Typography>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: theme.spacing(2) }}>
            {paragraphs.map((paragraph) => (
              <Typography
                key={paragraph.slice(0, 32)}
                variant="body1"
                color="text.primary"
                sx={{ lineHeight: 1.75, maxWidth: "70ch" }}
              >
                {paragraph}
              </Typography>
            ))}
          </Box>

          {post.media.map((media) => (
            <ProjectMedia key={media.src} media={media} />
          ))}
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default BlogPostClient;

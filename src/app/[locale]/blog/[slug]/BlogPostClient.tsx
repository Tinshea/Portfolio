"use client";

import React from "react";
import Markdoc from "@markdoc/markdoc";
import { Box, Button, Typography, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/Footer";
import ProjectMedia from "@/components/ProjectMedia";
import { BlogPost } from "@/types";
import useIsMobile from "@/hooks/useIsMobile";

// Rendered for {% youtube %} blocks inserted from the Keystatic editor.
const YouTube: React.FC<{ url?: string; caption?: string }> = ({ url, caption }) => {
  if (!url) return null;
  return (
    <Box sx={{ marginY: 2 }}>
      <ProjectMedia media={{ type: "youtube", src: url, caption }} />
    </Box>
  );
};

const BlogPostClient: React.FC<{ post: BlogPost }> = ({ post }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const t = useTranslations("Blog");
  const locale = useLocale();

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
              "@media (prefers-reduced-motion: no-preference)": {
                animation: "riseIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
              },
            }}
          >
            {post.title}
          </Typography>

          {formattedDate && (
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "var(--font-geist-mono), monospace" }}>
              {formattedDate}
            </Typography>
          )}

          {/* Editorial styles applied to the rendered Markdoc tree: sections
              (h2), subsections (h3), inline images and video embeds. */}
          {post.body && (
            <Box
              sx={{
                color: theme.palette.text.primary,
                "& p": { lineHeight: 1.75, maxWidth: "70ch", margin: 0, marginBottom: theme.spacing(2) },
                "& h2": {
                  fontSize: isMobile ? "1.35rem" : "1.6rem",
                  fontWeight: 700,
                  marginTop: theme.spacing(4),
                  marginBottom: theme.spacing(1.5),
                },
                "& h3": {
                  fontSize: isMobile ? "1.1rem" : "1.25rem",
                  fontWeight: 600,
                  marginTop: theme.spacing(3),
                  marginBottom: theme.spacing(1),
                },
                "& img": {
                  display: "block",
                  maxWidth: "100%",
                  borderRadius: 3,
                  marginY: theme.spacing(2),
                },
                "& ul, & ol": { lineHeight: 1.75, paddingLeft: theme.spacing(3), marginBottom: theme.spacing(2) },
                "& a": { color: theme.palette.secondary.main },
                "& blockquote": {
                  borderLeft: `3px solid ${theme.palette.secondary.main}`,
                  margin: 0,
                  paddingLeft: theme.spacing(2),
                  color: theme.palette.text.secondary,
                },
                "& code": {
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.9em",
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 1,
                  padding: "0.1em 0.35em",
                },
                "& pre": {
                  fontFamily: "var(--font-geist-mono), monospace",
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                  padding: theme.spacing(2),
                  overflowX: "auto",
                },
              }}
            >
              {Markdoc.renderers.react(post.body, React, { components: { YouTube } })}
            </Box>
          )}

          {/* Legacy trailing media gallery (entries created before inline media). */}
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

"use client";

import React from "react";
import { Card, CardActionArea, CardContent, Typography, Box, Grid } from "@mui/material";
import { useLocale } from "next-intl";
import { BlogPost } from "@/types";
import { Link } from "@/navigation";
import useIsMobile from "@/hooks/useIsMobile";

interface BlogPostsProps {
  posts: BlogPost[];
}

const BlogPosts: React.FC<BlogPostsProps> = ({ posts }) => {
  const isMobile = useIsMobile();
  const locale = useLocale();

  const formatDate = (iso: string) => {
    if (!iso) return "";
    try {
      return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 2, width: "100%", maxWidth: "1000px" }}>
      <Grid container spacing={isMobile ? 1 : 3}>
        {posts.map((post) => {
          // Project entries link to their existing project page; regular
          // articles link to their blog post page.
          const href = post.projectSlug
            ? ({ pathname: "/projects/[slug]", params: { slug: post.projectSlug } } as const)
            : ({ pathname: "/blog/[slug]", params: { slug: post.slug } } as const);
          return (
            <Grid item xs={12} md={6} key={post.slug}>
              <Card sx={{ height: "100%" }}>
                <Link href={href} passHref legacyBehavior>
                  <CardActionArea component="a" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography variant="h5" component="h2" sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem", fontWeight: "bold" }}>
                        {post.title}
                      </Typography>
                      <Typography sx={{ mb: 1.5, color: "text.secondary", fontSize: isMobile ? "0.875rem" : "1rem" }}>
                        {formatDate(post.date)}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
                        {post.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default BlogPosts;

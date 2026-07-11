"use client";

import React from "react";
import { Card, CardContent, Typography, Box, Grid, Button, useTheme, useMediaQuery } from "@mui/material";
import { useTranslations } from "next-intl";

// Définir un type pour les articles de blog
interface BlogPost {
  title: string;
  date: string;
  description: string;
  link: string;
}

// Définir un type pour les props du composant BlogPosts
interface BlogPostsProps {
  posts: BlogPost[];
}

const BlogPosts: React.FC<BlogPostsProps> = ({ posts }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const t = useTranslations("Category");

  return (
    <Box sx={{ p: isMobile ? 1 : 2 }}>
      <Grid container spacing={isMobile ? 1 : 3}>
        {posts.map((post, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: "100%", borderRadius: 1, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 'bold' }}>
                  {post.title}
                </Typography>
                <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: isMobile ? '0.875rem' : '1rem' }}>
                  {post.date}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, fontSize: isMobile ? '0.875rem' : '1rem' }}>
                  {post.description}
                </Typography>
                <Button variant="outlined" href={post.link} sx={{ mt: 1, borderColor: theme.palette.primary.main, color: theme.palette.primary.main }}>
                  {t("readMore")}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BlogPosts;

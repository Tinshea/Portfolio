"use client";

import React from "react";
import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { FeaturedItem } from "@/types";
import { handleBannerError, isGitHubOpenGraph, parseGitHubRepo, repoBannerUrl } from "@/lib/banner";

// Featured blocks are managed in the /keystatic admin (content/projects/*).
// An entry with a long body gets a dedicated case-study page at
// /projects/[slug]; see CONTENT.md at the repo root.

// md column spans, repeating: 7/5 then 5/7 for an asymmetric rhythm.
const COLUMN_SPANS = [7, 5, 5, 7] as const;

// A hand-picked image overrides everything; a bare OpenGraph URL doesn't count
// (it's just GitHub's default) so the repo's committed banner can win.
function hasExplicitImage(item: FeaturedItem): boolean {
  return !!item.image && !isGitHubOpenGraph(item.image);
}

// The GitHub repo backing a card's banner chain, unless an explicit image wins.
function cardRepo(item: FeaturedItem): { user: string; name: string } | null {
  return hasExplicitImage(item) ? null : parseGitHubRepo(item.link);
}

export function cardImage(item: FeaturedItem): string {
  if (hasExplicitImage(item)) return item.image!;
  const repo = parseGitHubRepo(item.link);
  // Committed banner.{jpg,png} first, then GitHub's OpenGraph render.
  if (repo) return repoBannerUrl(repo.user, repo.name);
  // A GitHub-less item may still carry an explicit OpenGraph URL.
  if (item.image) return item.image;
  // TODO(design): replace with a real photo of the project (e.g. the homelab).
  return `https://picsum.photos/seed/${encodeURIComponent(item.name)}/800/500`;
}

const FeaturedCardContent: React.FC<{ item: FeaturedItem }> = ({ item }) => {
  const repo = cardRepo(item);
  return (
  <>
    <CardMedia
      component="img"
      image={cardImage(item)}
      alt={`${item.name} preview`}
      // For GitHub-backed cards, fall through banner → OpenGraph on error.
      onError={repo ? (e) => handleBannerError(e, repo.user, repo.name) : undefined}
      // 2:1 matches GitHub's OpenGraph renders so their text never gets
      // cropped (a fixed height used to cut the repo title on mobile).
      sx={{ objectFit: "cover", aspectRatio: "2 / 1", width: "100%", flexShrink: 0 }}
    />
    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, flexGrow: 1, width: "100%" }}>
      <Typography variant="h5" component="h4" color="text.primary">
        {item.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        {item.description}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: "auto" }}>
        {item.tags.map((tag) => (
          <Chip key={tag} label={tag} size="small" variant="outlined" />
        ))}
      </Box>
    </CardContent>
  </>
  );
};

const actionAreaSx = { height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" } as const;

const FeaturedCard: React.FC<{ item: FeaturedItem }> = ({ item }) => {
  // Blog-post entries link to their post page.
  if (item.blogSlug) {
    return (
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Link href={{ pathname: "/blog/[slug]", params: { slug: item.blogSlug } }} passHref legacyBehavior>
          <CardActionArea component="a" sx={actionAreaSx}>
            <FeaturedCardContent item={item} />
          </CardActionArea>
        </Link>
      </Card>
    );
  }

  // Case-study entries open their dedicated page; plain entries link out.
  if (item.details && item.slug) {
    return (
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Link href={{ pathname: "/projects/[slug]", params: { slug: item.slug } }} passHref legacyBehavior>
          <CardActionArea component="a" sx={actionAreaSx}>
            <FeaturedCardContent item={item} />
          </CardActionArea>
        </Link>
      </Card>
    );
  }

  if (item.link) {
    return (
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardActionArea
          component="a"
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          sx={actionAreaSx}
        >
          <FeaturedCardContent item={item} />
        </CardActionArea>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <FeaturedCardContent item={item} />
    </Card>
  );
};

const FeaturedProjects: React.FC<{ items: FeaturedItem[] }> = ({ items }) => {
  const t = useTranslations("Featured");

  if (items.length === 0) return null;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h6"
        component="h3"
        color="text.secondary"
        sx={{ marginBottom: 2 }}
      >
        {t("heading")}
      </Typography>
      <Grid container spacing={3}>
        {items.map((item, index) => (
          <Grid item xs={12} md={COLUMN_SPANS[index % COLUMN_SPANS.length]} key={item.name}>
            <FeaturedCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedProjects;

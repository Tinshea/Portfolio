"use client";

import React from "react";
import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { FeaturedItem } from "@/types";

// Featured blocks are managed in the /keystatic admin (content/projects/*).
// An entry with a long body gets a dedicated case-study page at
// /projects/[slug]; see CONTENT.md at the repo root.

// md column spans, repeating: 7/5 then 5/7 for an asymmetric rhythm.
const COLUMN_SPANS = [7, 5, 5, 7] as const;

export function cardImage(item: FeaturedItem): string {
  if (item.image) return item.image;
  const github = item.link?.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)/);
  if (github) return `https://opengraph.githubassets.com/1/${github[1]}`;
  // TODO(design): replace with a real photo of the project (e.g. the homelab).
  return `https://picsum.photos/seed/${encodeURIComponent(item.name)}/800/500`;
}

const FeaturedCardContent: React.FC<{ item: FeaturedItem }> = ({ item }) => (
  <>
    <CardMedia
      component="img"
      image={cardImage(item)}
      alt={`${item.name} preview`}
      sx={{ objectFit: "cover", height: 200, width: "100%", flexShrink: 0 }}
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

const actionAreaSx = { height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" } as const;

const FeaturedCard: React.FC<{ item: FeaturedItem }> = ({ item }) => {
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

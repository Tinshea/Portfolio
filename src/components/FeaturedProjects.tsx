"use client";

import React from "react";
import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { FeaturedItem } from "@/types";

// Featured blocks are data-driven: add or edit entries in messages/{en,fr}.json
// under Featured.items (code projects with a GitHub link, or non-code work
// like the homelab). No code change needed for new entries.

// md column spans, repeating: 7/5 then 5/7 for an asymmetric rhythm.
const COLUMN_SPANS = [7, 5, 5, 7] as const;

function cardImage(item: FeaturedItem): string {
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
    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, flexGrow: 1 }}>
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

const FeaturedCard: React.FC<{ item: FeaturedItem }> = ({ item }) => (
  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    {item.link ? (
      <CardActionArea
        component="a"
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <FeaturedCardContent item={item} />
      </CardActionArea>
    ) : (
      <FeaturedCardContent item={item} />
    )}
  </Card>
);

const FeaturedProjects: React.FC = () => {
  const t = useTranslations("Featured");
  const rawItems = t.raw("items");
  const items: FeaturedItem[] = Array.isArray(rawItems) ? (rawItems as FeaturedItem[]) : [];

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

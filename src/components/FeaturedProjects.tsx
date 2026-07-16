"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import { useTranslations } from "next-intl";
import { FeaturedItem, FeaturedMedia } from "@/types";

// Featured blocks are data-driven: add or edit entries in messages/{en,fr}.json
// under Featured.items. An entry with a `details` field opens a rich dialog on
// click (long text + images/videos); see CONTENT.md at the repo root.

// md column spans, repeating: 7/5 then 5/7 for an asymmetric rhythm.
const COLUMN_SPANS = [7, 5, 5, 7] as const;

function cardImage(item: FeaturedItem): string {
  if (item.image) return item.image;
  const github = item.link?.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)/);
  if (github) return `https://opengraph.githubassets.com/1/${github[1]}`;
  // TODO(design): replace with a real photo of the project (e.g. the homelab).
  return `https://picsum.photos/seed/${encodeURIComponent(item.name)}/800/500`;
}

const MediaBlock: React.FC<{ media: FeaturedMedia }> = ({ media }) => {
  if (media.type === "youtube") {
    return (
      <Box sx={{ position: "relative", paddingTop: "56.25%", borderRadius: 2, overflow: "hidden" }}>
        <Box
          component="iframe"
          src={media.src}
          title={media.caption ?? "video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      </Box>
    );
  }
  if (media.type === "video") {
    return (
      <Box
        component="video"
        src={media.src}
        controls
        playsInline
        sx={{ width: "100%", borderRadius: 2, display: "block" }}
      />
    );
  }
  return (
    <Box
      component="img"
      src={media.src}
      alt={media.caption ?? ""}
      sx={{ width: "100%", borderRadius: 2, display: "block" }}
    />
  );
};

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

interface FeaturedCardProps {
  item: FeaturedItem;
  onOpen: (item: FeaturedItem) => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ item, onOpen }) => {
  const hasDetails = Boolean(item.details);

  if (hasDetails) {
    return (
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardActionArea
          onClick={() => onOpen(item)}
          sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
        >
          <FeaturedCardContent item={item} />
        </CardActionArea>
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
          sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
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

const FeaturedProjects: React.FC = () => {
  const t = useTranslations("Featured");
  const rawItems = t.raw("items");
  const items: FeaturedItem[] = Array.isArray(rawItems) ? (rawItems as FeaturedItem[]) : [];
  const [openItem, setOpenItem] = useState<FeaturedItem | null>(null);

  if (items.length === 0) return null;

  const bodyParagraphs = openItem?.details?.body?.split(/\n\s*\n/).filter(Boolean) ?? [];
  const isGitHubLink = openItem?.link?.startsWith("https://github.com/");

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
            <FeaturedCard item={item} onOpen={setOpenItem} />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openItem !== null}
        onClose={() => setOpenItem(null)}
        fullWidth
        maxWidth="md"
        aria-labelledby="featured-dialog-title"
      >
        {openItem && (
          <>
            <DialogTitle
              id="featured-dialog-title"
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}
            >
              {openItem.name}
              <IconButton aria-label={t("close")} onClick={() => setOpenItem(null)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {openItem.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
              {bodyParagraphs.map((paragraph) => (
                <Typography key={paragraph.slice(0, 32)} variant="body1" sx={{ lineHeight: 1.7 }}>
                  {paragraph}
                </Typography>
              ))}
              {openItem.details?.media?.map((media) => (
                <Box key={media.src}>
                  <MediaBlock media={media} />
                  {media.caption && (
                    <Typography variant="body2" color="text.secondary" sx={{ marginTop: 0.5 }}>
                      {media.caption}
                    </Typography>
                  )}
                </Box>
              ))}
            </DialogContent>
            {openItem.link && (
              <DialogActions>
                <Button
                  component="a"
                  href={openItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={isGitHubLink ? <GitHubIcon /> : <LaunchIcon />}
                >
                  {isGitHubLink ? "GitHub" : openItem.link.replace(/^https?:\/\//, "")}
                </Button>
              </DialogActions>
            )}
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default FeaturedProjects;

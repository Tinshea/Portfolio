"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { FeaturedMedia } from "@/types";

const MediaBlock: React.FC<{ media: FeaturedMedia }> = ({ media }) => {
  if (media.type === "youtube") {
    return (
      <Box sx={{ position: "relative", paddingTop: "56.25%", borderRadius: 3, overflow: "hidden" }}>
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
        sx={{ width: "100%", borderRadius: 3, display: "block" }}
      />
    );
  }
  return (
    <Box
      component="img"
      src={media.src}
      alt={media.caption ?? ""}
      sx={{ width: "100%", borderRadius: 3, display: "block" }}
    />
  );
};

const ProjectMedia: React.FC<{ media: FeaturedMedia }> = ({ media }) => (
  <Box>
    <MediaBlock media={media} />
    {media.caption && (
      <Typography variant="body2" color="text.secondary" sx={{ marginTop: 0.5 }}>
        {media.caption}
      </Typography>
    )}
  </Box>
);

export default ProjectMedia;

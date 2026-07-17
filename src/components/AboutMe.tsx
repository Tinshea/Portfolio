"use client";

import React from "react";
import { Box, Chip, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import useIsMobile from "@/hooks/useIsMobile";

interface AboutMeProps {
  description: string;
  stack: string[];
}

const AboutMe: React.FC<AboutMeProps> = ({ description, stack }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const t = useTranslations("HomePage");

  return (
    <Box
      sx={{
        padding: isMobile ? theme.spacing(4) : theme.spacing(8),
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "center",
        alignItems: isMobile ? "stretch" : "flex-start",
        gap: isMobile ? theme.spacing(4) : theme.spacing(8),
        maxWidth: "1200px",
        margin: "0 auto",
      }}
      id="aboutme"
    >
      {/* Text column */}
      <Box sx={{ flex: "1 1 60%" }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: theme.palette.text.primary,
            marginBottom: theme.spacing(3),
            textTransform: "uppercase",
            letterSpacing: "0.1rem",
            fontSize: isMobile ? "1.5rem" : "2rem",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          {t("about")}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.primary,
            fontSize: isMobile ? "1rem" : "1.1rem",
            lineHeight: 1.7,
            maxWidth: "65ch",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* Tech stack panel */}
      {stack.length > 0 && (
        <Box sx={{ flex: "1 1 40%", maxWidth: isMobile ? "100%" : "360px" }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              color: theme.palette.text.secondary,
              marginBottom: theme.spacing(2),
              textAlign: isMobile ? "center" : "left",
            }}
          >
            {t("stackTitle")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            {stack.map((tech) => (
              <Chip key={tech} label={tech} variant="outlined" />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AboutMe;

"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import NavBar from "@/components/navbar/NavBar";
import ExperienceList from "@/components/experiencesPages/ExperienceList";
import { ExperienceType } from "@/types";
import useIsMobile from "@/hooks/useIsMobile";

export default function ExperiencesClient() {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const t = useTranslations("Category");
  const t_experience = useTranslations("Experiences");
  const rawExperiencesData = t_experience.raw("experiencesData");

  let experiences: ExperienceType[] = [];

  if (Array.isArray(rawExperiencesData)) {
    experiences = rawExperiencesData as ExperienceType[];
  } else {
    console.error(
      "Unexpected data format for experiencesData:",
      rawExperiencesData
    );
  }

  return (
    <>
      <NavBar alwaysShowTopNav={true} />
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          minHeight: "100vh",
          paddingTop: theme.spacing(10),
        }}
      >
        <Typography
          variant="h1"
          color="text.primary"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.1rem",
            fontSize: isMobile ? "1.5rem" : "2rem",
          }}
        >
          {t("experiences")}
        </Typography>
        <ExperienceList experiences={experiences} />
      </Box>
    </>
  );
}

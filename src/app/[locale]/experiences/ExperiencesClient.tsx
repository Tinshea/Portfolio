"use client";

import React from "react";
import { Box, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import NavBar from "@/components/navbar/NavBar";
import ExperienceList from "@/components/experiencesPages/ExperienceList";
import { ExperienceType } from "@/types";

export default function ExperiencesClient() {
  const theme = useTheme();
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
        }}
      >
        <ExperienceList experiences={experiences} />
      </Box>
    </>
  );
}

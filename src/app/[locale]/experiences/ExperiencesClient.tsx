"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import NavBar from "@/components/navbar/NavBar";
import ExperienceList from "@/components/experiencesPages/ExperienceList";
import { ExperienceType } from "@/types";
import useIsMobile from "@/hooks/useIsMobile";

const StarsBackground = dynamic(() => import("@/components/StarsBackground"), { ssr: false });

interface ExperiencesClientProps {
  readonly experiences: ExperienceType[];
  readonly formations: ExperienceType[];
}

export default function ExperiencesClient({ experiences, formations }: ExperiencesClientProps) {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const t = useTranslations("Category");

  const headingSx = {
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "0.1rem",
    fontSize: isMobile ? "1.5rem" : "2rem",
    "@media (prefers-reduced-motion: no-preference)": {
      animation: "riseIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
    },
  } as const;

  return (
    <>
      <StarsBackground />
      <NavBar alwaysShowTopNav={true} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          paddingTop: theme.spacing(10),
        }}
      >
        <Typography variant="h1" color="text.primary" sx={headingSx}>
          {t("experiences")}
        </Typography>
        <ExperienceList experiences={experiences} />

        {formations.length > 0 && (
          <>
            <Typography variant="h2" color="text.primary" sx={headingSx}>
              {t("formations")}
            </Typography>
            <ExperienceList experiences={formations} />
          </>
        )}
      </Box>
    </>
  );
}

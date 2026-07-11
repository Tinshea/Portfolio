"use client";

import React, { useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import user from "@/data/user.json";
import { useTranslations } from "next-intl";
import NavBar from "@/components/navbar/NavBar";
import ExperienceList from "../../../components/experiencesPages/ExperienceList";
import Head from "next/head";

interface ExperienceType {
  id: number;
  title: string;
  company: string;
  description: string;
  date: string;
  tags: string[];
  logo?: string;
}

const Experience: React.FC = () => {
  const theme = useTheme();
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

  useEffect(() => {
    document.title = user.name + " | " + t("experiences");
  }, [t]);

  return (
    <>
      <Head>
        <title>Malek Bouzarkouna | Experiences</title>
        <meta name="description" content="Experiences of Malek Bouzarkouna." />
        <meta name="keywords" content="Malek Bouzarkouna, experiences, portfolio" />
        <meta property="og:title" content="Malek Bouzarkouna | Experiences" />
        <meta property="og:description" content="Experiences of Malek Bouzarkouna." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.malekbouzarkouna.com/experiences" />
        <meta property="og:image" content="https://www.malekbouzarkouna.com/og-image.jpg" />
      </Head>
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
};

export default Experience;

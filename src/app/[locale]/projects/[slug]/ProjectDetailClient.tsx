"use client";

import React from "react";
import { Box, Button, Chip, Stack, Typography, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/Footer";
import ProjectMedia from "@/components/ProjectMedia";
import { FeaturedItem } from "@/types";
import useIsMobile from "@/hooks/useIsMobile";

const ProjectDetailClient: React.FC<{ item: FeaturedItem }> = ({ item }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const t = useTranslations("Featured");

  const paragraphs = item.details?.body?.split(/\n\s*\n/).filter(Boolean) ?? [];
  const isGitHubLink = item.link?.startsWith("https://github.com/");

  return (
    <>
      <NavBar alwaysShowTopNav={true} />
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          component="article"
          sx={{
            width: "100%",
            maxWidth: "860px",
            margin: "0 auto",
            padding: isMobile ? theme.spacing(3) : theme.spacing(4),
            paddingTop: theme.spacing(12),
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing(3),
            flexGrow: 1,
          }}
        >
          <Box>
            <Link href={{ pathname: "/", hash: "#projects" }} passHref legacyBehavior>
              <Button component="a" startIcon={<ArrowBackIcon />} sx={{ marginLeft: -1 }}>
                {t("backToProjects")}
              </Button>
            </Link>
          </Box>

          <Typography
            variant="h1"
            color="text.primary"
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.1rem",
              fontSize: isMobile ? "1.75rem" : "2.5rem",
              lineHeight: 1.2,
            }}
          >
            {item.name}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {item.tags.map((tag) => (
              <Chip key={tag} label={tag} variant="outlined" />
            ))}
          </Stack>

          {item.image && (
            <Box
              component="img"
              src={item.image}
              alt={item.name}
              sx={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 3 }}
            />
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: theme.spacing(2) }}>
            {paragraphs.map((paragraph) => (
              <Typography
                key={paragraph.slice(0, 32)}
                variant="body1"
                color="text.primary"
                sx={{ lineHeight: 1.75, maxWidth: "70ch" }}
              >
                {paragraph}
              </Typography>
            ))}
          </Box>

          {item.details?.media?.map((media) => (
            <ProjectMedia key={media.src} media={media} />
          ))}

          {item.link && (
            <Box>
              <Button
                variant="outlined"
                component="a"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={isGitHubLink ? <GitHubIcon /> : <LaunchIcon />}
              >
                {isGitHubLink ? "GitHub" : item.link.replace(/^https?:\/\//, "")}
              </Button>
            </Box>
          )}
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default ProjectDetailClient;

import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, Alert, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import ProjectCard from "../ProjectCard";
import SeeMoreButton from "../SeeMoreButton";
import FeaturedProjects from "../FeaturedProjects";
import { FeaturedItem, PinnedRepo } from "@/types";
import useIsMobile from "@/hooks/useIsMobile";

const PinnedRepositories: React.FC<{ username: string }> = ({ username }) => {
  const [pinnedRepos, setPinnedRepos] = useState<PinnedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const t = useTranslations("HomePage");
  const tFeatured = useTranslations("Featured");

  // Detect mobile screen size
  const isMobile = useIsMobile();
  const maxProjects = isMobile ? 3 : 6;

  useEffect(() => {
    const fetchPinnedRepos = async () => {
      try {
        const response = await fetch(`/api/pinned-repos?username=${encodeURIComponent(username)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const repos = await response.json();
        setPinnedRepos(repos);
      } catch (error) {
        console.error("Error fetching repositories:", error);
        setError("Failed to load repositories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPinnedRepos();
  }, [username]);

  // Featured projects are curated above; keep the GitHub feed free of duplicates.
  const rawFeatured = tFeatured.raw("items");
  const featuredNames = Array.isArray(rawFeatured)
    ? (rawFeatured as FeaturedItem[]).map((item) => item.name)
    : [];
  const gridRepos = pinnedRepos
    .filter((repo) => !featuredNames.includes(repo.name))
    .slice(0, maxProjects);

  return (
    <Box
      sx={{
        padding: isMobile ? theme.spacing(6) : theme.spacing(12),
        paddingTop: isMobile ? theme.spacing(3) : theme.spacing(6),
        paddingBottom: isMobile ? theme.spacing(3) : theme.spacing(6),
        margin: "auto",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      id="projects"
    >
      <Typography
        variant="h2"
        color={theme.palette.text.primary}
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: theme.spacing(4),
          textTransform: "uppercase",
          letterSpacing: "0.1rem",
          fontSize: isMobile ? "1.5rem" : "2rem",
          zIndex: 1,
        }}
      >
        {t("projects")}
      </Typography>

      <Box sx={{ width: "100%", maxWidth: isMobile ? "100%" : "1250px", margin: "auto" }}>
        <FeaturedProjects />

        {loading && (
          <Grid container spacing={isMobile ? 2 : 4} sx={{ marginTop: isMobile ? 0 : 1 }}>
            {Array.from({ length: maxProjects }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                {/* Skeletons match the final card shape instead of a generic spinner. */}
                <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && error && (
          <Alert severity="error" sx={{ marginTop: 4 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && gridRepos.length > 0 && (
          <>
            <Typography
              variant="h6"
              component="h3"
              color="text.secondary"
              sx={{ marginTop: 5, marginBottom: 2 }}
            >
              {tFeatured("githubHeading")}
            </Typography>
            <Grid container spacing={isMobile ? 2 : 4}>
              {gridRepos.map((repo) => (
                <Grid item xs={12} sm={6} md={4} key={repo.name}>
                  <ProjectCard
                    user={username}
                    name={repo.name}
                    description={repo.description}
                    stargazerCount={repo.stargazerCount}
                    forkCount={repo.forkCount}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {!loading && (
          <Box sx={{ marginTop: theme.spacing(3), width: "100%", display: "flex", flexDirection: "row-reverse" }}>
            <SeeMoreButton hrefstring="/projects" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PinnedRepositories;

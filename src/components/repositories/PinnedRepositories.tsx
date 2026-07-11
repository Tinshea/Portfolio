import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, CircularProgress, Alert, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import ProjectCard from "../ProjectCard";
import SeeMoreButton from "../SeeMoreButton";

interface PinnedRepo {
  name: string;
  description: string;
  forkCount: number;
  stargazerCount: number;
}

const PinnedRepositories: React.FC<{ username: string }> = ({ username }) => {
  const [pinnedRepos, setPinnedRepos] = useState<PinnedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const t = useTranslations("HomePage");

  // Detect mobile screen size
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const maxProjects = isMobile ? 3 : 6;

  useEffect(() => {
    const fetchPinnedRepos = async () => {
      const query = `
        {
          user(login: "${username}") {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  name
                  description
                  forkCount
                  stargazerCount
                }
              }
            }
          }
        }
      `;

      try {
        const response = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const { data } = await response.json();
        const repos = data.user.pinnedItems.nodes.map((repo: any) => ({
          name: repo.name,
          description: repo.description,
          forkCount: repo.forkCount,
          stargazerCount: repo.stargazerCount,
        }));
        setPinnedRepos(repos);
      } catch (error) {
        try {
          const fallbackResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
          const data = await fallbackResponse.json();
          setPinnedRepos(data);
        } catch (fallbackError) {
          console.error("Error fetching repositories:", fallbackError);
          setError("Failed to load repositories. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPinnedRepos();
  }, [username]);

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
        color={theme.palette.primary.main}
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: theme.spacing(3),
          textTransform: "uppercase",
          letterSpacing: "0.1rem",
          fontSize: isMobile ? "1.5rem" : "2rem",
          zIndex: 1,
        }}
      >
        {t("projects")}
      </Typography>
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {!loading && error && (
        <>
          <Alert severity="error" sx={{ marginTop: 5, marginLeft: "auto", marginRight: "auto", maxWidth: isMobile ? "100%" : "1250px" }}>
            {error}
          </Alert>
          <Box sx={{ marginTop: theme.spacing(3), width: "100%", display: "flex", flexDirection: "row-reverse", marginRight: isMobile ? 1 : 2.5, maxWidth: isMobile ? "100%" : "1250px" }}>
            <SeeMoreButton hrefstring="/projects" />
          </Box>
        </>
        
      )}
      {!loading && !error && (
        <Box sx={{ maxWidth: isMobile ? "100%" : "1250px", margin: "auto", marginTop: isMobile ? 1 : 2 }}>
          <Grid container spacing={isMobile ? 2 : 4} >
            {pinnedRepos.slice(0, maxProjects).map((repo) => (
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
          {/* See More button */}
          <Box sx={{ marginTop: theme.spacing(3), width: "100%", display: "flex", flexDirection: "row-reverse", marginRight: isMobile ? 1 : 2.5, maxWidth: isMobile ? "100%" : "1250px" }}>
            <SeeMoreButton hrefstring="/projects" />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PinnedRepositories;

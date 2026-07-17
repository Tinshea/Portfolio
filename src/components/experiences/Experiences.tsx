import React from "react";
import Experience from "./Experience";
import { Box, Typography, useTheme, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import SeeMoreButton from "../SeeMoreButton";
import { ExperienceType } from "@/types";
import useIsMobile from "@/hooks/useIsMobile";

interface ExperiencesProps {
  experiences: ExperienceType[];
}

const Experiences: React.FC<ExperiencesProps> = ({ experiences: allExperiences }) => {
  const t = useTranslations("HomePage");
  const theme = useTheme();
  const isMobile = useIsMobile();

  const maxExperiences = 3;
  const experiences = allExperiences.slice(0, maxExperiences);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: isMobile ? theme.spacing(6) : theme.spacing(12),
        paddingBottom: isMobile ? theme.spacing(1.5) : theme.spacing(6),
        margin: "auto",
        minHeight: "50vh",
      }}
      id="experiences"
    >
      {/* Header section */}
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
        {t("experiences")}
      </Typography>

      {/* Experiences list */}
      {experiences.length > 0 ? (
        <Grid container sx={{ maxWidth: isMobile ? "100%" : "1250px" }}>
          {experiences.map((experience, index) => (
            <Grid
              item
              xs={12}
              key={experience.title + experience.company + experience.date}
              sx={{
                "@media (prefers-reduced-motion: no-preference)": {
                  animation: "riseIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
                  animationDelay: `${Math.min(index, 8) * 90}ms`,
                },
              }}
            >
              <Experience
                id={experience.id}
                title={experience.title}
                company={experience.company}
                description={experience.description}
                date={experience.date}
                tags={experience.tags}
                logo={experience.logo}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="body2"
          color={theme.palette.text.secondary}
          sx={{
            textAlign: "center",
            fontStyle: "italic",
            marginTop: theme.spacing(3),
          }}
        >
          {t("no_experiences")}
        </Typography>
      )}

      {/* See More button */}
      <Box sx={{ marginTop: theme.spacing(3), width: "100%", display: "flex", flexDirection: "row-reverse", marginRight: isMobile ? 1 : 2.5, maxWidth: isMobile ? "100%" : "1250px" }}>
        <SeeMoreButton hrefstring="/experiences" />
      </Box>
    </Box>
  );
};

export default Experiences;

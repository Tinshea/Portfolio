import React from "react";
import { Box, Typography, useTheme, Chip } from "@mui/material";
import { ExperienceType } from "@/types";
import useIsMobile from "@/hooks/useIsMobile";

interface ExperienceItemProps {
  experience: ExperienceType;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ experience }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row", // Column layout on mobile
          alignItems: isMobile ? "stretch" : "center",
          gap: isMobile ? 0 : theme.spacing(4),
          width: "100%",
          maxWidth: "1250px",
          position: "relative",
          mb: isMobile ? 1 : 2, // Reduced margin bottom for mobile
          mt: isMobile ? 1 : 2, // Reduced margin bottom for mobile
          p: isMobile ? 1 : 2, // Reduced padding for mobile
          boxSizing: "border-box",
        }}
      >
        {/* Colonne pour les dates */}
        <Box
          sx={{
            flex: isMobile ? "none" : "1 1 20%", // Adjust flex on mobile
            textAlign: isMobile ? "center" : "left",
            padding: theme.spacing(1),
          }}
        >
          <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
            {experience.date}
          </Typography>
          {
            experience.logo && (
              <Box mt={1} display="flex" justifyContent="center">
                <img
                  src={experience.logo}
                  alt={`${experience.company} logo`}
                  style={{
                    maxWidth: "108px",
                    height: 'auto',
                  }}
                />
              </Box>
            )
          }
        </Box>

        {/* Colonne droite pour le contenu de l'expérience */}
        <Box
          sx={{
            flex: isMobile ? "1 1 auto" : "1 1 80%",
            textAlign: "left",
            padding: theme.spacing(1),
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="body2"
            component="h2"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              fontSize: isMobile ? "0.875rem" : "1rem",
              margin: 0,
            }}
          >
            {experience.title}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              mb: isMobile ? theme.spacing(1) : theme.spacing(3),
            }}
          >
            {experience.company}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              color: theme.palette.primary.main,
            }}
          >
            {experience.description}
          </Typography>
          <Box
            mt={isMobile ? theme.spacing(2) : theme.spacing(4)}
            display="flex"
            justifyContent={isMobile ? "center" : "left"}
            flexWrap="wrap"
            gap={1}
          >
            {experience.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                variant="outlined"
                sx={{
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  fontSize: isMobile ? "0.8rem" : "1rem", // Taille de la police réduite sur mobile
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default ExperienceItem;

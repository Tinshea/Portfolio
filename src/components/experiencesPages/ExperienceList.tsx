import React from "react";
import { Divider, Grid, useMediaQuery, useTheme } from "@mui/material";
import ExperienceItem from "./ExperienceItem";

interface ExperienceType {
  id: number;
  title: string;
  company: string;
  description: string;
  date: string;
  tags: string[];
  logo?: string;
}

interface ExperienceListProps {
  experiences: ExperienceType[];
}

const ExperienceList: React.FC<ExperienceListProps> = ({ experiences }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid
      container
      direction="column"
      alignItems={isMobile ? "stretch" : "center"}
      sx={{ p: isMobile ? 4 : 8 }}
    >
      {experiences.map((experience) => (
        <Grid item xs={12} key={experience.title}>
          <ExperienceItem experience={experience} />
          <Divider />
        </Grid>
      ))}
    </Grid>
  );
};

export default ExperienceList;

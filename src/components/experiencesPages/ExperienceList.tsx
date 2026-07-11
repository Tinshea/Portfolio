import React from "react";
import { Divider, Grid } from "@mui/material";
import ExperienceItem from "./ExperienceItem";
import { ExperienceType } from "@/types";
import useIsMobile from "@/hooks/useIsMobile";

interface ExperienceListProps {
  experiences: ExperienceType[];
}

const ExperienceList: React.FC<ExperienceListProps> = ({ experiences }) => {
  const isMobile = useIsMobile();

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

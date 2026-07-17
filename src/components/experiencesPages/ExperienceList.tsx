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
      {experiences.map((experience, index) => (
        <Grid
          item
          xs={12}
          key={experience.title}
          sx={{
            "@media (prefers-reduced-motion: no-preference)": {
              animation: "riseIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
              animationDelay: `${Math.min(index, 8) * 90}ms`,
            },
          }}
        >
          <ExperienceItem experience={experience} />
          <Divider />
        </Grid>
      ))}
    </Grid>
  );
};

export default ExperienceList;

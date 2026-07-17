"use client";

import NavBar from "@/components/navbar/NavBar";
import StarsBackground from "@/components/StarsBackground";
import UserRepositories from "@/components/repositories/UserRepositories";
import user from "@/data/user.json";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import useIsMobile from "@/hooks/useIsMobile";

export default function ProjectsClient() {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const t = useTranslations("ProjectsPage");

  return (
    <>
      <StarsBackground />
      <NavBar alwaysShowTopNav={true} />
      <Box sx={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        paddingTop: theme.spacing(10),
      }}>
        <Typography
          variant="h1"
          color="text.primary"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.1rem",
            fontSize: isMobile ? "1.5rem" : "2rem",
            "@media (prefers-reduced-motion: no-preference)": {
              animation: "riseIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
            },
          }}
        >
          {t("title")}
        </Typography>
        <UserRepositories username={user.githubusername} />
      </Box>
    </>
  );
}

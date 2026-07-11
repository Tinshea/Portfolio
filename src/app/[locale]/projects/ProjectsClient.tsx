"use client";

import NavBar from "@/components/navbar/NavBar";
import UserRepositories from "@/components/repositories/UserRepositories";
import user from "@/data/user.json";
import { Box, useTheme } from "@mui/material";

export default function ProjectsClient() {
  const theme = useTheme();

  return (
    <>
      <NavBar alwaysShowTopNav={true} />
      <Box sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}>
        <UserRepositories username={user.githubusername} />
      </Box>
    </>
  );
}

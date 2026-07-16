"use client";

import React from "react";
import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useTranslations } from "next-intl";
import user from "@/data/user.json";
import useIsMobile from "@/hooks/useIsMobile";

const ContactSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const t = useTranslations("Contact");

  return (
    <Box
      id="contact"
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: isMobile ? theme.spacing(6) : theme.spacing(12),
        paddingTop: isMobile ? theme.spacing(4) : theme.spacing(8),
        gap: theme.spacing(3),
      }}
    >
      <Typography
        variant="h2"
        color="text.primary"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "0.1rem",
          fontSize: isMobile ? "1.5rem" : "2rem",
        }}
      >
        {t("title")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "45ch" }}>
        {t("text")}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        startIcon={<EmailIcon />}
        href={`mailto:${user.email}`}
        sx={{ color: theme.palette.getContrastText(theme.palette.secondary.main) }}
      >
        {user.email}
      </Button>
      <Stack direction="row" spacing={2}>
        <IconButton
          aria-label="GitHub"
          component="a"
          href={`https://github.com/${user.githubusername}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </IconButton>
        <IconButton
          aria-label="LinkedIn"
          component="a"
          href={`https://linkedin.com/in/${user.linkedinusername}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default ContactSection;

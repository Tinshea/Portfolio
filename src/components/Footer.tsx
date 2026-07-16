"use client";

import React from "react";
import { Box, Link as MuiLink, Stack, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import user from "@/data/user.json";

const Footer: React.FC = () => {
  const theme = useTheme();
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(3, 4),
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: theme.spacing(1.5),
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {`© ${year} ${user.name}. ${t("rights")}`}
      </Typography>
      <Stack direction="row" spacing={3}>
        <MuiLink
          href={`https://github.com/${user.githubusername}`}
          target="_blank"
          rel="noopener noreferrer"
          color="text.secondary"
          underline="hover"
          variant="body2"
        >
          GitHub
        </MuiLink>
        <MuiLink
          href={`https://linkedin.com/in/${user.linkedinusername}`}
          target="_blank"
          rel="noopener noreferrer"
          color="text.secondary"
          underline="hover"
          variant="body2"
        >
          LinkedIn
        </MuiLink>
        <MuiLink
          href={`mailto:${user.email}`}
          color="text.secondary"
          underline="hover"
          variant="body2"
        >
          Email
        </MuiLink>
      </Stack>
    </Box>
  );
};

export default Footer;

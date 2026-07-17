"use client";

import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SendIcon from "@mui/icons-material/Send";
import { useTranslations } from "next-intl";
import user from "@/data/user.json";
import useIsMobile from "@/hooks/useIsMobile";

interface ContactSectionProps {
  readonly formEnabled?: boolean;
}

const ContactSection: React.FC<ContactSectionProps> = ({ formEnabled = false }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

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

      {formEnabled && status !== "sent" && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing(2),
            textAlign: "left",
          }}
        >
          <Stack direction={isMobile ? "column" : "row"} spacing={2}>
            <TextField
              name="name"
              label={t("formName")}
              required
              fullWidth
              inputProps={{ maxLength: 200 }}
            />
            <TextField
              name="email"
              type="email"
              label={t("formEmail")}
              required
              fullWidth
              inputProps={{ maxLength: 320 }}
            />
          </Stack>
          <TextField
            name="message"
            label={t("formMessage")}
            required
            fullWidth
            multiline
            minRows={4}
            inputProps={{ maxLength: 5000 }}
          />
          {/* Honeypot: hidden from humans, bots fill it and get discarded. */}
          <Box sx={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
            <input name="company" type="text" tabIndex={-1} autoComplete="off" />
          </Box>
          {status === "error" && <Alert severity="error">{t("formError")}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            size="large"
            disabled={status === "sending"}
            endIcon={<SendIcon />}
            sx={{
              alignSelf: isMobile ? "stretch" : "flex-end",
              color: theme.palette.getContrastText(theme.palette.secondary.main),
            }}
          >
            {status === "sending" ? t("formSending") : t("formSend")}
          </Button>
        </Box>
      )}
      {formEnabled && status === "sent" && (
        <Alert severity="success" sx={{ maxWidth: "600px" }}>
          {t("formSuccess")}
        </Alert>
      )}

      {formEnabled && (
        <Typography variant="body2" color="text.secondary">
          {t("orEmail")}
        </Typography>
      )}
      <Button
        variant={formEnabled ? "outlined" : "contained"}
        color="secondary"
        size="large"
        startIcon={<EmailIcon />}
        href={`mailto:${user.email}`}
        sx={
          formEnabled
            ? undefined
            : { color: theme.palette.getContrastText(theme.palette.secondary.main) }
        }
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

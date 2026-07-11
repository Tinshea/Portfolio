"use client";

import React from "react";
import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import useIsMobile from "@/hooks/useIsMobile";

const Laptop3D = dynamic(() => import("./Laptop3D"), {
  ssr: false,
  loading: () => (
    <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress color="inherit" />
    </Box>
  ),
});

interface AboutMeProps {
  description: string;
}

const AboutMe: React.FC<AboutMeProps> = ({ description }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const t = useTranslations("HomePage");

  return (
    <Box
      sx={{
        padding: isMobile ? theme.spacing(3) : theme.spacing(6),
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "center",
        alignItems: "center",
        textAlign: isMobile ? "center" : "left",
        overflow: "hidden",
        height: "50vh",
      }}
      id="aboutme"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          transform: "translate(-50%, -50%)",
          zIndex: -1,
        }}
      />

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          zIndex: 1,
        }}
      >
        {/* Header Section */}
        <Typography
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          variant={isMobile ? "h4" : "h2"}
          sx={{
            fontWeight: "bold",
            color: theme.palette.primary.main,
            marginBottom: theme.spacing(4),
            textTransform: "uppercase",
            letterSpacing: "0.1rem",
            textShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
            padding: theme.spacing(2),
          }}
        >
          {t("about")}
        </Typography>

        {/* Description Section */}
        <Typography
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: isMobile ? "100%" : "800px",
            fontSize: isMobile ? "1rem" : "1.2rem",
            lineHeight: "1.6",
            padding: theme.spacing(2),
            textAlign: "justify",
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* 3D Model Section */}
      <Box
        component={motion.div}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: isMobile ? "100%" : "auto",
          height: "100%",
          zIndex: 1,
        }}
      >
        <Laptop3D />
      </Box>
    </Box>
  );
};

export default AboutMe;

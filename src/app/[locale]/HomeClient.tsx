"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import NavBar from "@/components/navbar/NavBar";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import Experiences from "@/components/experiences/Experiences";
import AboutMe from "@/components/AboutMe";
import PinnedRepositories from "@/components/repositories/PinnedRepositories";
import user from "@/data/user.json";
import AnimatedSection from "@/components/AnimatedSection";
import { TextDecrypt } from "@/components/TextDecrypt";
import useIsMobile from "@/hooks/useIsMobile";

const StarsBackground = dynamic(() => import("@/components/StarsBackground"), { ssr: false });

export default function HomeClient() {
  const t = useTranslations("HomePage");
  const theme = useTheme();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      videoRef.current?.pause();
    }
  }, [prefersReducedMotion]);

  return (
    <>
      <StarsBackground />
      <Box
        component="video"
        ref={videoRef}
        autoPlay
        muted
        loop
        preload="auto"
        playsInline
        controlsList="nodownload"
        sx={{
          position: "fixed", // Change to fixed to keep it in place during scroll
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: 0,
          objectFit: "cover",
          transform: "rotate(180deg)",
          opacity: prefersReducedMotion ? 0 : theme.palette.mode === "dark" ? 0.6 : 0.07,
          filter: "blur(3px)",
        }}
      >
        <source src="/assets/blackhole.webm" type="video/webm" />
      </Box>
      <NavBar />

      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? theme.spacing(2) : theme.spacing(4), // Adjust padding for mobile
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "80%", // Set width to 100% to center the content
            height: { xs: "60vh", lg: "70vh" }, // Set a specific height for the Laptop3D container
            overflow: "hidden", // Prevent overflow if the content exceeds the container
            zIndex: 0, // Ensure it stays above other elements
            display: "flex",
            flexDirection: "row",
            left: "50%",
            transform: "translateX(-50%)",
            alignItems: "center",
            justifyContent: "center", // Center the content horizontally
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h1"
              color={theme.palette.primary.main}
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: theme.spacing(2),
                textTransform: "uppercase",
                letterSpacing: "0.15rem",
                fontSize: isMobile ? "1.5rem" : "2.5rem", // Adjust font size for mobile
              }}
            >
              <TextDecrypt text={t("title")} />
            </Typography>
            <Typography
              variant="h2"
              color={theme.palette.primary.main}
              sx={{
                textAlign: "center",
                marginBottom: theme.spacing(10),
                letterSpacing: "0.15rem",
                fontSize: isMobile ? "1rem" : "2rem", // Adjust font size for mobile
              }}
            >
              <TextDecrypt text={t("subtitle")} />
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ backgroundColor: theme.palette.background.default }}>
        <Box sx={{ backgroundColor: theme.palette.background.alternative }}>
          <AnimatedSection>
            <AboutMe description={t("description")} />
          </AnimatedSection>
        </Box>
        <AnimatedSection>
          <Experiences />
        </AnimatedSection>
        <AnimatedSection>
          <PinnedRepositories username={user.githubusername} />
        </AnimatedSection>
      </Box>
    </>
  );
}

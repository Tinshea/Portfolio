"use client";

import dynamic from "next/dynamic";
import NavBar from "@/components/navbar/NavBar";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import { useResumeHref } from "@/contexts/Providers";
import Experiences from "@/components/experiences/Experiences";
import AboutMe from "@/components/AboutMe";
import PinnedRepositories from "@/components/repositories/PinnedRepositories";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import user from "@/data/user.json";
import AnimatedSection from "@/components/AnimatedSection";
import { TextDecrypt } from "@/components/TextDecrypt";
import useIsMobile from "@/hooks/useIsMobile";
import { FeaturedItem } from "@/types";

const StarsBackground = dynamic(() => import("@/components/StarsBackground"), { ssr: false });

export default function HomeClient({ featuredItems }: { readonly featuredItems: FeaturedItem[] }) {
  const t = useTranslations("HomePage");
  const tNav = useTranslations("Navbar");
  const resumeHref = useResumeHref();
  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <>
      <StarsBackground />
      <NavBar />

      {/* Hero: typographic and fully transparent, so the starfield and the
          body-level sky gradient (see theme MuiCssBaseline) show through. */}
      <Box
        component="section"
        sx={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          padding: isMobile ? theme.spacing(2) : theme.spacing(4),
        }}
      >
        <Box sx={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          <Typography
            variant="h1"
            color={theme.palette.text.primary}
            sx={{
              fontWeight: "bold",
              textAlign: { xs: "center", md: "left" },
              marginBottom: theme.spacing(2),
              textTransform: "uppercase",
              letterSpacing: "0.15rem",
              fontSize: "clamp(2.25rem, 6vw, 4.25rem)",
              lineHeight: 1.12,
            }}
          >
            <TextDecrypt text={t("title")} />
          </Typography>
          <Typography
            variant="h2"
            color={theme.palette.secondary.main}
            sx={{
              textAlign: { xs: "center", md: "left" },
              marginBottom: theme.spacing(5),
              letterSpacing: "0.15rem",
              fontSize: "clamp(1.15rem, 2.5vw, 2rem)",
            }}
          >
            <TextDecrypt text={t("subtitle")} />
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component="a"
              href="#contact"
              sx={{ color: theme.palette.getContrastText(theme.palette.secondary.main) }}
            >
              {t("contact")}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component="a"
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tNav("resume")}
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ backgroundColor: theme.palette.background.default, position: "relative", zIndex: 1 }}>
        <Box sx={{ backgroundColor: theme.palette.background.alternative }}>
          <AnimatedSection>
            <AboutMe description={t("description")} />
          </AnimatedSection>
        </Box>
        <AnimatedSection>
          <Experiences />
        </AnimatedSection>
        <AnimatedSection>
          <PinnedRepositories username={user.githubusername} featuredItems={featuredItems} />
        </AnimatedSection>
        <AnimatedSection>
          <ContactSection />
        </AnimatedSection>
        <Footer />
      </Box>
    </>
  );
}

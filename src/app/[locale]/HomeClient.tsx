"use client";

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
import { ExperienceType, FeaturedItem } from "@/types";
import { AboutContent } from "@/lib/about";

import StarsBackground from "@/components/StarsBackground";

export default function HomeClient({
  featuredItems,
  experiences,
  about,
  contactFormEnabled,
}: {
  readonly featuredItems: FeaturedItem[];
  readonly experiences: ExperienceType[];
  readonly about: AboutContent;
  readonly contactFormEnabled: boolean;
}) {
  const t = useTranslations("HomePage");
  const tNav = useTranslations("Navbar");
  const resumeHref = useResumeHref();
  const theme = useTheme();

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
          // Breakpoint padding (not JS mobile detection): the static HTML must
          // already be right on phones, before hydration.
          padding: { xs: theme.spacing(2), md: theme.spacing(4) },
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
              // Offset-print shadow on the display name: the magazine-cover
              // register, in the page accent at low opacity. Solid ink fill:
              // the decrypt effect alone carries the Y2K reference.
              textShadow:
                theme.palette.mode === "dark"
                  ? "4px 4px 0 rgba(226, 75, 96, 0.25)"
                  : "4px 4px 0 rgba(163, 18, 46, 0.18)",
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
              // Editorial serif italic against the engraved uppercase title;
              // line-height guards the descenders (g, j) from clipping.
              fontStyle: "italic",
              lineHeight: 1.2,
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
            <AboutMe description={about.description} stack={about.stack} />
          </AnimatedSection>
        </Box>
        <AnimatedSection>
          <Experiences experiences={experiences} />
        </AnimatedSection>
        <AnimatedSection>
          <PinnedRepositories username={user.githubusername} featuredItems={featuredItems} />
        </AnimatedSection>
        <AnimatedSection>
          <ContactSection formEnabled={contactFormEnabled} />
        </AnimatedSection>
        <Footer />
      </Box>
    </>
  );
}

"use client";

import { Stack, Button, IconButton, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { Link } from "@/navigation";
import { useResumeHref } from "@/contexts/Providers";
import { NAV_LINKS, resolveNavHref } from "./navLinks";

const NavBarItems = () => {
  const t = useTranslations("Navbar");
  const resumeHref = useResumeHref();
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={2} component="ul" sx={{ listStyle: "none", margin: 0, padding: 0 }}>
      {NAV_LINKS.map((link) => {
        if (link.isStaticAsset) {
          return (
            <NextLink key={link.key} href={resolveNavHref(link, resumeHref)} passHref legacyBehavior>
              <Button variant="text" component="a" target="_blank" sx={{ color: theme.palette.text.primary, textTransform: "none" }}>
                {t(link.translationKey)}
              </Button>
            </NextLink>
          );
        }

        if (link.key === "home") {
          return (
            <Link key={link.key} href={link.href} passHref legacyBehavior>
              <IconButton aria-label={t("home")} component="a">
                <HomeIcon sx={{ color: theme.palette.text.primary }} />
              </IconButton>
            </Link>
          );
        }

        return (
          <Link key={link.key} href={link.href} passHref legacyBehavior>
            <Button variant="text" component="a" sx={{ color: theme.palette.text.primary, textTransform: "none" }}>
              {t(link.translationKey)}
            </Button>
          </Link>
        );
      })}
    </Stack>
  );
};

export default NavBarItems;

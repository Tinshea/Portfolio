import React, { useState, MouseEvent, useTransition } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { SxProps, Theme } from "@mui/material/styles";
import { useParams } from "next/navigation";

import { useRouter, usePathname } from "@/navigation";
import { useLocale } from "next-intl";

// The two flags ship as local SVGs (public/flags/), replacing react-flag-kit
// which loaded them from a CDN and never declared React 19 support.
function FlagIcon({ code, style }: { readonly code: "US" | "FR"; readonly style?: React.CSSProperties }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/flags/${code}.svg`} alt="" style={style} />;
}

interface LanguageSelectorProps {
  /** Where the menu opens relative to the trigger. Use "top" when the button sits near the bottom of the viewport. */
  menuPlacement?: "top" | "bottom";
  /** Extra styles for the trigger button (e.g. boxShadow to match sibling buttons). */
  sx?: SxProps<Theme>;
}

export default function LanguageSelector({ menuPlacement = "bottom", sx }: Readonly<LanguageSelectorProps>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // The flag always reflects the live locale.
  const locale = useLocale();

  const router = useRouter();
  const [, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language: "en" | "fr") => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- The current params always match the current
        // pathname; TypeScript can't correlate the two union members.
        { pathname, params },
        { locale: language }
      );
    });
    handleMenuClose();
  };

  const flagCode = locale === "fr" ? "FR" : "US";

  // The menu opens away from the button (above when placed at the bottom of
  // the screen) so it never covers its own trigger.
  const menuOrigins =
    menuPlacement === "top"
      ? {
          anchorOrigin: { vertical: "top", horizontal: "center" } as const,
          transformOrigin: { vertical: "bottom", horizontal: "center" } as const,
        }
      : {
          anchorOrigin: { vertical: "bottom", horizontal: "center" } as const,
          transformOrigin: { vertical: "top", horizontal: "center" } as const,
        };

  return (
    // Fragment root: a wrapping <div> used to break flex alignment in the
    // navbars (the sibling buttons are direct flex children).
    <>
      {/* Flag only, fixed 40px square: the hover/focus halo stays a perfect
          circle like every sibling icon button. */}
      <IconButton
        aria-label="Language"
        aria-haspopup="menu"
        onClick={handleMenuOpen}
        sx={{ color: "text.primary", width: 40, height: 40, ...sx }}
      >
        <FlagIcon code={flagCode} style={{ width: "24px", height: "16px", display: "block" }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        {...menuOrigins}
      >
        <MenuItem selected={locale === "en"} onClick={() => handleLanguageChange("en")}>
          <FlagIcon
            code="US"
            style={{ width: "24px", height: "16px", marginRight: "8px" }}
          />
          English
        </MenuItem>
        <MenuItem selected={locale === "fr"} onClick={() => handleLanguageChange("fr")}>
          <FlagIcon
            code="FR"
            style={{ width: "24px", height: "16px", marginRight: "8px" }}
          />
          Français
        </MenuItem>
      </Menu>
    </>
  );
}

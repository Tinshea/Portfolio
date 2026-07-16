import React, { useState, MouseEvent, useTransition } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { SxProps, Theme } from "@mui/material/styles";
import { FlagIcon } from "react-flag-kit";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { useRouter, usePathname } from "@/navigation";
import { useLocale } from "next-intl";

interface LanguageSelectorProps {
  isArrow?: boolean;
  /** Extra styles for the trigger button (e.g. boxShadow to match sibling buttons). */
  sx?: SxProps<Theme>;
}

export default function LanguageSelector({ isArrow = false, sx }: Readonly<LanguageSelectorProps>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // The flag always reflects the live locale (a local state here used to keep
  // showing the previous language after switching).
  const locale = useLocale();

  const router = useRouter();
  const [, startTransition] = useTransition();
  const pathname = usePathname();

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language: "en" | "fr") => {
    startTransition(() => {
      router.replace({ pathname }, { locale: language });
    });
    handleMenuClose();
  };

  const flagCode = locale === "fr" ? "FR" : "US";

  return (
    // Fragment root: a wrapping <div> used to break flex alignment in the
    // navbars (the sibling buttons are direct flex children).
    <>
      <IconButton
        aria-label="Language"
        aria-haspopup="menu"
        onClick={handleMenuOpen}
        sx={{ color: "text.primary", ...sx }}
      >
        <FlagIcon code={flagCode} style={{ width: "24px", height: "16px", display: "block" }} />
        {isArrow && <ArrowDropDownIcon fontSize="small" sx={{ marginLeft: 0.5 }} />}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
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

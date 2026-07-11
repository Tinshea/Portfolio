import React, { useState, MouseEvent, useTransition } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import { FlagIcon } from "react-flag-kit";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { useRouter, usePathname } from "@/navigation";
import { useLocale } from "next-intl";

interface LanguageSelectorProps {
  isArrow?: boolean;
}

export default function LanguageSelector({ isArrow = false }: LanguageSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const locale = useLocale();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(locale);
  const theme = useTheme();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    startTransition(() => {
      router.replace(
        {
          pathname,
        },
        { locale: language as "en" | "fr" | undefined }
      );
    });
    handleMenuClose();
  };

  const getFlagCode = (language: string) => {
    switch (language) {
      case "fr":
        return "FR";
      case "en":
        return "US";
      default:
        return "US";
    }
  };

  return (
    <div>
      <IconButton
        sx={{
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
        aria-label="Language"
        onClick={handleMenuOpen}
        style={{ color: theme.palette.text.primary }}
      >
        <FlagIcon
          code={getFlagCode(selectedLanguage)}
          style={{ width: "24px", height: "16px" }}
        />
        {isArrow && <ArrowDropDownIcon style={{ marginLeft: "8px" }} />}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleLanguageChange("en")}>
          <FlagIcon
            code="US"
            style={{ width: "24px", height: "16px", marginRight: "8px" }}
          />{" "}
          English
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange("fr")}>
          <FlagIcon
            code="FR"
            style={{ width: "24px", height: "16px", marginRight: "8px" }}
          />{" "}
          Français
        </MenuItem>
      </Menu>
    </div>
  );
}

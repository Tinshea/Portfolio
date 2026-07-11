"use client";

import { useTheme, useMediaQuery } from "@mui/material";

/**
 * Single source of truth for the "mobile" breakpoint, pinned to the same
 * threshold (900px / theme.breakpoints.down("md")) the navbar switches at,
 * so the whole page reflows at one consistent viewport width.
 */
export default function useIsMobile(): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
}

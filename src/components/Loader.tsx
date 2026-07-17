"use client";

import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { FONT_SERIF } from "@/themes";

// Theme is not mounted yet on this screen: colors mirror src/themes tokens,
// resolved from the persisted preference like the previous loader did.
const PALETTES = {
  dark: { background: "#0B0E16", color: "#F2F1EC", accent: "#E24B60", track: "rgba(242, 241, 236, 0.18)" },
  light: { background: "#F4F4F2", color: "#17171A", accent: "#A3122E", track: "rgba(23, 23, 26, 0.18)" },
};

export default function Loader() {
  const [palette, setPalette] = useState(PALETTES.dark);

  useEffect(() => {
    if (window.localStorage.getItem("theme") === "light") {
      setPalette(PALETTES.light);
    }
  }, []);

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ width: "100%", minHeight: "100dvh", backgroundColor: palette.background }}
    >
      <Typography
        sx={{
          fontFamily: FONT_SERIF,
          textTransform: "uppercase",
          letterSpacing: "0.35em",
          // Compensates the trailing letter-spacing so the name reads centered.
          paddingLeft: "0.35em",
          fontSize: "clamp(1rem, 3.5vw, 1.5rem)",
          fontWeight: 600,
          color: palette.color,
          textAlign: "center",
          "@keyframes riseIn": {
            from: { opacity: 0, transform: "translateY(28px)" },
            to: { opacity: 1, transform: "none" },
          },
          "@media (prefers-reduced-motion: no-preference)": {
            animation: "riseIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
          },
        }}
      >
        Malek Bouzarkouna
      </Typography>

      {/* Engraved rule with a sweeping accent runner; static accent line
          under prefers-reduced-motion. */}
      <Box
        sx={{
          position: "relative",
          width: 180,
          height: 3,
          marginTop: 3,
          borderTop: `1px solid ${palette.track}`,
          borderBottom: `1px solid ${palette.track}`,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "38%",
            backgroundColor: palette.accent,
            "@keyframes loaderSweep": {
              from: { transform: "translateX(-110%)" },
              to: { transform: "translateX(380%)" },
            },
            "@media (prefers-reduced-motion: no-preference)": {
              animation: "loaderSweep 1.2s cubic-bezier(0.45, 0, 0.2, 1) infinite",
            },
          }}
        />
      </Box>
    </Stack>
  );
}

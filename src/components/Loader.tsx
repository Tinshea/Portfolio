"use client";

import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import Stack from "@mui/material/Stack";

export default function Loader() {
  const [colors, setColors] = useState({ background: "#0B0E16", color: "#F2F1EC" });

  useEffect(() => {
    if (window.localStorage.getItem("theme") === "light") {
      setColors({ background: "#F4F4F2", color: "#17171A" });
    }
  }, []);

  return (
    <Stack direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ width: "100%", height: "100vh", backgroundColor: colors.background, color: colors.color }}
    >
        <CircularProgress thickness={4} size="10vh" color="inherit" />
    </Stack>
  );
}

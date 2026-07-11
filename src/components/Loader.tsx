"use client";

import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import Stack from "@mui/material/Stack";

export default function Loader() {
  const [colors, setColors] = useState({ background: "#121212", color: "#ffffff" });

  useEffect(() => {
    if (window.localStorage.getItem("theme") === "light") {
      setColors({ background: "#ffffff", color: "#121212" });
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

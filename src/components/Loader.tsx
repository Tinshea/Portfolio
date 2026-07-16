"use client";

import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import Stack from "@mui/material/Stack";

export default function Loader() {
  const [colors, setColors] = useState({ background: "#0e1114", color: "#f4f4f5" });

  useEffect(() => {
    if (window.localStorage.getItem("theme") === "light") {
      setColors({ background: "#fafafa", color: "#1c2227" });
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

"use client";

import { Box, Typography, Button } from "@mui/material";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 4,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Une erreur est survenue / Something went wrong
      </Typography>
      <Button variant="outlined" onClick={() => reset()}>
        Réessayer / Try again
      </Button>
    </Box>
  );
}

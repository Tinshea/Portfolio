import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";

export default function NotFound() {
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
      <Typography variant="h2" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        404
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 4 }}>
        Page introuvable / Page not found.
      </Typography>
      <Button component={Link} href="/" variant="outlined">
        Retour à l&apos;accueil
      </Button>
    </Box>
  );
}

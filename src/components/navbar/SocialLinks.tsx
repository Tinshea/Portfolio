import { Stack, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LanguageSelector from "../LanguageSelector";
import { useMode } from "@/contexts/ModeProvider";

interface SocialLinksProps {
  githubusername: string;
  linkedinusername: string;
}

const SocialLinks = ({ githubusername, linkedinusername }: Readonly<SocialLinksProps>) => {
  const { mode, toggleMode } = useMode();

  return (
    <Stack direction="row" spacing={2} component="ul" sx={{ listStyle: "none", margin: 0, padding: 0 }}>
      <IconButton href={`https://github.com/${githubusername}`} aria-label="GitHub" target="_blank">
        <GitHubIcon sx={{ color: "white" }} />
      </IconButton>
      <IconButton href={`https://linkedin.com/in/${linkedinusername}`} aria-label="LinkedIn" target="_blank">
        <LinkedInIcon sx={{ color: "white" }} />
      </IconButton>
      <IconButton
        aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        onClick={() => toggleMode(mode)}
      >
        {mode === "dark" ? <LightModeIcon sx={{ color: "white" }} /> : <DarkModeIcon sx={{ color: "white" }} />}
      </IconButton>
      <LanguageSelector />
    </Stack>
  );
};

export default SocialLinks;

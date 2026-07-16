import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Button, Box } from "@mui/material";
import LanguageSelector from "../LanguageSelector";
import { useMode } from "@/contexts/ModeProvider";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { useResumeHref } from "@/contexts/Providers";

interface SideNavBarProps {
  githubusername: string;
  linkedinusername: string;
}

export default function SideNavBar({
  githubusername,
  linkedinusername,
}: Readonly<SideNavBarProps>) {
  const { mode, toggleMode } = useMode();
  const t = useTranslations("Navbar");
  const resumeHref = useResumeHref();

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        // The wrapper spans the whole viewport; only the button clusters below
        // should catch clicks, otherwise it would block the hero CTAs.
        pointerEvents: 'none',
      }}
    >
      {/* Navigation for projects, experiences, resume */}
      <Box
        component="ul"
        sx={{
          position: 'absolute',
          left: '30px',
          top: '25px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          pointerEvents: 'auto',
        }}
      >
        <Box component="li" sx={{ margin: '10px 0' }}>
          <Button variant="text" component="a" href="#projects">
            {t("projects")}
          </Button>
        </Box>
        <Box component="li" sx={{ margin: '10px 0' }}>
          <Button variant="text" component="a" href="#experiences">
            {t("experiences")}
          </Button>
        </Box>
        <Box component="li" sx={{ margin: '10px 0' }}>
          <Link href="/blog" passHref legacyBehavior>
            <Button variant="text" component="a">
              {t("blog")}
            </Button>
          </Link>
        </Box>
        <Box component="li" sx={{ margin: '10px 0' }}>
          <Button
            variant="text"
            component="a"
            href={resumeHref}
            target="_blank"
          >
            {t("resume")}
          </Button>
        </Box>
      </Box>

      {/* Social Media Buttons */}
      <Box
        component="ul"
        sx={{
          position: 'absolute',
          right: '30px',
          top: '25px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          pointerEvents: 'auto',
        }}
      >
        <Box component="li">
          <IconButton
            aria-label="GitHub"
            component="a"
            href={`https://github.com/${githubusername}`}
            target="_blank"
            sx={{ boxShadow: 2 }}
          >
            <GitHubIcon />
          </IconButton>
        </Box>
        <Box component="li">
          <IconButton
            aria-label="LinkedIn"
            component="a"
            href={`https://linkedin.com/in/${linkedinusername}`}
            target="_blank"
            sx={{ boxShadow: 2 }}
          >
            <LinkedInIcon />
          </IconButton>
        </Box>
        {/* <Box component="li">
          <IconButton
            aria-label="Blog"
            component="a"
            href="/blog"
            sx={{ boxShadow: 2 }}
          >
            <BookIcon />
          </IconButton>
        </Box> */}
      </Box>

      {/* Theme Toggle and Language Selector */}
      <Box
        component="ul"
        sx={{
          position: 'absolute',
          right: '30px',
          bottom: '25px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          pointerEvents: 'auto',
        }}
      >
        <Box component="li">
          <IconButton
            aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => toggleMode(mode)}
            sx={{ boxShadow: 2 }}
          >
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
        <Box component="li">
          <LanguageSelector isArrow={true} />
        </Box>
      </Box>
    </Box>
  );
}

import { Box, useTheme, alpha } from "@mui/material";
import { motion, MotionValue } from "framer-motion";
import NavBarItems from "./NavBarItems";
import SocialLinks from "./SocialLinks";

interface DesktopNavBarProps {
  githubusername: string;
  linkedinusername: string;
  progress: MotionValue<number>;
}

const DesktopNavBar = ({ githubusername, linkedinusername, progress }: Readonly<DesktopNavBarProps>) => {
  const theme = useTheme();

  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          padding: "5px",
        }}
      >
        <NavBarItems />
        <SocialLinks githubusername={githubusername} linkedinusername={linkedinusername} />
      </Box>
      {/* Reading-progress bar in the brand accent, driven by a motion value. */}
      <motion.div
        style={{
          scaleX: progress,
          transformOrigin: "0% 50%",
          height: 2,
          backgroundColor: theme.palette.secondary.main,
        }}
      />
    </Box>
  );
};

export default DesktopNavBar;

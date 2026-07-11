import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import DesktopNavBar from "./DesktopNavBar";
import MenuDrawer from "./MenuDrawer";
import useIsMobile from "@/hooks/useIsMobile";

interface TopNavBarProps {
  githubusername: string;
  linkedinusername: string;
  progress: number;
}

export default function TopNavBar({ githubusername, linkedinusername, progress }: Readonly<TopNavBarProps>) {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            aria-label="Menu"
            onClick={toggleDrawer(true)}
            sx={{ position: "fixed", top: 16, left: 16, zIndex: 1200 }}
          >
            <MenuIcon />
          </IconButton>
          <MenuDrawer
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            githubusername={githubusername}
            linkedinusername={linkedinusername}
          />
        </>
      ) : (
        <DesktopNavBar
          githubusername={githubusername}
          linkedinusername={linkedinusername}
          progress={progress}
        />
      )}
    </>
  );
}

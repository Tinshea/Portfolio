import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import MenuDrawer from "./MenuDrawer";

interface MobileNavProps {
  githubusername: string;
  linkedinusername: string;
}

export default function MobileNav({ githubusername, linkedinusername }: Readonly<MobileNavProps>) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
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
  );
}

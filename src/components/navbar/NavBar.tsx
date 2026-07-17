"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Box } from "@mui/material";
import user from "@/data/user.json";
import SideNavBar from "./SideNavBar";
import DesktopNavBar from "./DesktopNavBar";
import MobileNav from "./MobileNav";

interface NavBarProps {
  alwaysShowTopNav?: boolean;  // Boolean prop to control top nav visibility
}

export default function NavBar({ alwaysShowTopNav = false }: Readonly<NavBarProps>) {
  // Scroll handling lives entirely in motion values: no React re-render per frame.
  const { scrollY, scrollYProgress } = useScroll();
  const visibility = useTransform(scrollY, [0, 600], [0, 1], { clamp: true });

  const sideOpacity = useTransform(visibility, (v) => 1 - v);
  const sideY = useTransform(visibility, (v) => v * -50);
  // visibility (not pointer-events) disables the whole faded side nav: the
  // wrapper itself must NEVER be a hit target, or it blocks the hero CTAs.
  const sideVisibility = useTransform(visibility, (v) => (v > 0.5 ? "hidden" : "visible"));

  const topPointerEvents = useTransform(visibility, (v) =>
    alwaysShowTopNav || v > 0.3 ? "auto" : "none"
  );

  // The mobile/desktop split is pure CSS (breakpoint display toggles), so the
  // statically rendered HTML is already correct on phones — no desktop nav
  // flashing while the page hydrates.
  return (
    <div className="navbar">
      {/* Desktop: full-viewport side nav that fades out as you scroll */}
      {!alwaysShowTopNav && (
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <motion.div
            style={{
              opacity: sideOpacity,
              y: sideY,
              visibility: sideVisibility,
              // The full-viewport wrapper passes clicks through; only the button
              // clusters inside SideNavBar re-enable pointer events.
              pointerEvents: "none",
              position: "fixed",
              width: "100%",
              top: 0,
              left: 0,
              // Above the page content (which is position:relative) but below the
              // top navbar (100) and the mobile drawer (1200).
              zIndex: 90,
            }}
          >
            <SideNavBar
              githubusername={user.githubusername}
              linkedinusername={user.linkedinusername}
            />
          </motion.div>
        </Box>
      )}

      {/* Desktop: top nav, static or revealed on scroll */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <motion.div
          style={{
            opacity: alwaysShowTopNav ? 1 : visibility,
            pointerEvents: alwaysShowTopNav ? "auto" : topPointerEvents,
            position: "fixed",
            width: "100%",
            top: 0,
            left: 0,
            zIndex: 100,
          }}
        >
          <DesktopNavBar
            githubusername={user.githubusername}
            linkedinusername={user.linkedinusername}
            progress={scrollYProgress}
          />
        </motion.div>
      </Box>

      {/* Mobile: always-visible hamburger + drawer */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <MobileNav
          githubusername={user.githubusername}
          linkedinusername={user.linkedinusername}
        />
      </Box>
    </div>
  );
}

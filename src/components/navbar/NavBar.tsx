"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import user from "@/data/user.json";
import SideNavBar from "./SideNavBar";
import TopNavBar from "./TopNavBar";
import useIsMobile from "@/hooks/useIsMobile";

interface NavBarProps {
  alwaysShowTopNav?: boolean;  // Boolean prop to control TopNavBar visibility
}

export default function NavBar({ alwaysShowTopNav = false }: Readonly<NavBarProps>) {
  const isMobile = useIsMobile();
  const staticTopNav = alwaysShowTopNav || isMobile;

  // Scroll handling lives entirely in motion values: no React re-render per frame.
  const { scrollY, scrollYProgress } = useScroll();
  const visibility = useTransform(scrollY, [0, 600], [0, 1], { clamp: true });

  const sideOpacity = useTransform(visibility, (v) => 1 - v);
  const sideY = useTransform(visibility, (v) => v * -50);
  // visibility (not pointer-events) disables the whole faded side nav: the
  // wrapper itself must NEVER be a hit target, or it blocks the hero CTAs.
  const sideVisibility = useTransform(visibility, (v) => (v > 0.5 ? "hidden" : "visible"));

  const topPointerEvents = useTransform(visibility, (v) =>
    staticTopNav || v > 0.3 ? "auto" : "none"
  );

  return (
    <div className="navbar">
      {/* SideNavBar: Only visible on non-mobile screens */}
      {!isMobile && !alwaysShowTopNav && (
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
      )}

      <motion.div
        style={{
          opacity: staticTopNav ? 1 : visibility,
          pointerEvents: staticTopNav ? "auto" : topPointerEvents,
          position: "fixed",
          width: "100%",
          top: 0,
          left: 0,
          zIndex: 100,
        }}
      >
        <TopNavBar
          githubusername={user.githubusername}
          linkedinusername={user.linkedinusername}
          progress={scrollYProgress}
        />
      </motion.div>
    </div>
  );
}

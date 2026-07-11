import { useEffect, useState } from "react";
import useDetectScroll from "@smakss/react-scroll-direction";
import user from "@/data/user.json";
import SideNavBar from "./SideNavBar";
import TopNavBar from "./TopNavBar";
import useIsMobile from "@/hooks/useIsMobile";

interface NavBarProps {
  alwaysShowTopNav?: boolean;  // Boolean prop to control TopNavBar visibility
}

export default function NavBar({ alwaysShowTopNav = false }: Readonly<NavBarProps>) {
  const isMobile = useIsMobile();
  const { scrollPosition } = useDetectScroll();
  const [visibility, setVisibility] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!alwaysShowTopNav && !isMobile) {
      const maxScroll = 600;
      const percentage = Math.min(scrollPosition.top / maxScroll, 1);
      setVisibility(percentage);

      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = scrollPosition.top;
      const maxScrollPosition = documentHeight - windowHeight;
      const progress = Math.min(scrollTop / maxScrollPosition, 1) * 100;
      setScrollProgress(progress);
    } else {
      setVisibility(1); // If alwaysShowTopNav is true or in mobile view, make TopNavBar fully visible
      setScrollProgress(100); // Optionally, set scrollProgress to 100    
    }
  }, [scrollPosition.top, alwaysShowTopNav, isMobile]);

  return (
    <div className="navbar">
      {/* SideNavBar: Only visible on non-mobile screens */}
      {!isMobile && !alwaysShowTopNav && (
        <div
          style={{
            opacity: 1 - visibility,
            transform: `translateY(${visibility * -50}px)`,
            transition: "none", // No transition
            position: "fixed",
            width: "100%",
            top: 0,
            left: 0,
            pointerEvents: visibility === 1 ? "none" : "auto", // Disable interactions when invisible
            userSelect: visibility === 1 ? "none" : "auto", // Disable text selection when invisible
          }}
        >
          <SideNavBar
            githubusername={user.githubusername}
            linkedinusername={user.linkedinusername}
          />
        </div>
      )}

      <div
        style={{
          opacity: alwaysShowTopNav || isMobile ? 1 : visibility,
          transform: "none", // No transform
          transition: "none", // No transition
          position: "fixed",
          width: "100%",
          top: 0,
          left: 0,
          zIndex: 100,
          pointerEvents: alwaysShowTopNav || isMobile || visibility > 0.30 ? "auto" : "none", // Disable interactions when invisible
          userSelect: alwaysShowTopNav || isMobile || visibility > 0.30 ? "auto" : "none", // Disable text selection when invisible
        }}
      >
        <TopNavBar
          githubusername={user.githubusername}
          linkedinusername={user.linkedinusername}
          progress={scrollProgress}
        />
      </div>
    </div>
  );
}

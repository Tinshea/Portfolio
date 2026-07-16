"use client";

import React from "react";

// Sections must be visible with zero JavaScript involvement: every previous
// variant (IntersectionObserver reveal, then mount-triggered fade) left the
// content stuck at the server-rendered `opacity: 0` on some machines. Baseline
// visibility is now pure HTML/CSS; motion lives only in user-triggered
// interactions elsewhere.
const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export default AnimatedSection;

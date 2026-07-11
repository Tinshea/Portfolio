export interface NavLinkItem {
  key: "home" | "experiences" | "projects" | "resume";
  href: string;
  translationKey: "home" | "experiences" | "projects" | "resume";
  /** True for links that are not part of next-intl's locale-aware routing (static assets, external files). */
  isStaticAsset?: boolean;
}

export const NAV_LINKS: NavLinkItem[] = [
  { key: "home", href: "/", translationKey: "home" },
  { key: "experiences", href: "/#experiences", translationKey: "experiences" },
  { key: "projects", href: "/#projects", translationKey: "projects" },
  { key: "resume", href: "/assets/resume.pdf", translationKey: "resume", isStaticAsset: true },
];

export interface NavLinkItem {
  key: "home" | "experiences" | "projects" | "blog" | "resume";
  href: string;
  translationKey: "home" | "experiences" | "projects" | "blog" | "resume";
  /** True for links that are not part of next-intl's locale-aware routing (static assets, external files). */
  isStaticAsset?: boolean;
}

export const NAV_LINKS: NavLinkItem[] = [
  { key: "home", href: "/", translationKey: "home" },
  { key: "experiences", href: "/#experiences", translationKey: "experiences" },
  { key: "projects", href: "/#projects", translationKey: "projects" },
  { key: "blog", href: "/blog", translationKey: "blog" },
  { key: "resume", href: "/assets/resume.pdf", translationKey: "resume", isStaticAsset: true },
];

/** Resolves a nav link's href, substituting the server-resolved resume path. */
export function resolveNavHref(link: NavLinkItem, resumeHref: string): string {
  return link.key === "resume" ? resumeHref : link.href;
}

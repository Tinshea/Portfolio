import type { AppHref } from "@/navigation";

interface LocalizedNavLink {
  key: "home" | "experiences" | "projects" | "blog";
  href: AppHref;
  translationKey: "home" | "experiences" | "projects" | "blog";
  isStaticAsset?: false;
}

/** The resume link points at a static PDF resolved server-side (see
 * useResumeHref); it bypasses next-intl's locale-aware routing. */
interface StaticAssetNavLink {
  key: "resume";
  translationKey: "resume";
  isStaticAsset: true;
}

export type NavLinkItem = LocalizedNavLink | StaticAssetNavLink;

export const NAV_LINKS: NavLinkItem[] = [
  { key: "home", href: "/", translationKey: "home" },
  { key: "experiences", href: { pathname: "/", hash: "#experiences" }, translationKey: "experiences" },
  { key: "projects", href: { pathname: "/", hash: "#projects" }, translationKey: "projects" },
  { key: "blog", href: "/blog", translationKey: "blog" },
  { key: "resume", translationKey: "resume", isStaticAsset: true },
];

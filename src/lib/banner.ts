// Shared preview-image logic for GitHub repositories.
//
// A repo can ship its own preview by committing a `banner.{jpg,png}` at its
// root (on `main` or `master`). When none exists we fall back to GitHub's
// OpenGraph render — the same default image the repo shows when its link is
// shared anywhere.

/**
 * True for GitHub's auto-generated OpenGraph render URL. Treated as a default
 * placeholder (not a hand-picked image), so a repo's committed banner wins over
 * it — OpenGraph still resolves as the final fallback in the banner chain.
 */
export function isGitHubOpenGraph(url?: string): boolean {
  return !!url && url.startsWith("https://opengraph.githubassets.com/");
}

/** Parse a GitHub repo URL into its owner/name, or null when it isn't one. */
export function parseGitHubRepo(url?: string): { user: string; name: string } | null {
  if (!url) return null;
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/?#]+)/);
  return match ? { user: match[1], name: match[2] } : null;
}

/**
 * Ordered list of preview candidates, tried until one loads:
 * a committed `banner.{jpg,png}` (on `main` then `master`), then the
 * OpenGraph fallback that always resolves.
 */
export function repoBannerCandidates(user: string, name: string): string[] {
  const raw = (branch: string, ext: string) =>
    `https://raw.githubusercontent.com/${user}/${name}/${branch}/banner.${ext}`;
  return [
    raw("main", "jpg"),
    raw("main", "png"),
    raw("master", "jpg"),
    raw("master", "png"),
    `https://opengraph.githubassets.com/1/${user}/${name}`,
  ];
}

/** First candidate to use as the initial `src` (the rest are reached on error). */
export function repoBannerUrl(user: string, name: string): string {
  return repoBannerCandidates(user, name)[0];
}

/**
 * `onError` handler that walks the candidate list until an image loads.
 * Tracks progress on the element's dataset so it survives re-renders; pass the
 * same `user`/`name` used to build the initial `src`.
 */
export function handleBannerError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  user: string,
  name: string,
): void {
  const img = event.currentTarget;
  const candidates = repoBannerCandidates(user, name);
  const nextStep = Number(img.dataset.bannerStep ?? "0") + 1;
  if (nextStep >= candidates.length) return; // exhausted: leave the last render
  img.dataset.bannerStep = String(nextStep);
  img.src = candidates[nextStep];
}

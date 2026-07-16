import fs from "fs";
import path from "path";

/**
 * Convention over configuration: drop a per-locale resume in public/assets
 * (resume-fr.pdf, resume-en.pdf) and it is picked up automatically; otherwise
 * the shared /assets/resume.pdf is used. Updating the resume is therefore just
 * replacing a file, no code or config change.
 */
export function getResumePath(locale: string): string {
  const localized = `resume-${locale}.pdf`;
  const absolute = path.join(process.cwd(), "public", "assets", localized);
  return fs.existsSync(absolute) ? `/assets/${localized}` : "/assets/resume.pdf";
}

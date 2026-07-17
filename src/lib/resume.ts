import fs from "fs";
import path from "path";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

/**
 * The resume link resolves in order:
 * 1. PDF uploaded via /keystatic ("CV" singleton), per locale, falling back to
 *    the other language;
 * 2. convention files dropped in public/assets (resume-fr.pdf / resume-en.pdf);
 * 3. the shared /assets/resume.pdf.
 */
export async function getResumePath(locale: string): Promise<string> {
  const cv = await reader.singletons.cv.read();
  const uploaded = locale === "fr" ? cv?.cvFr || cv?.cvEn : cv?.cvEn || cv?.cvFr;
  if (uploaded) {
    return uploaded.startsWith("/") ? uploaded : `/assets/${uploaded}`;
  }

  const localized = `resume-${locale}.pdf`;
  const absolute = path.join(process.cwd(), "public", "assets", localized);
  return fs.existsSync(absolute) ? `/assets/${localized}` : "/assets/resume.pdf";
}

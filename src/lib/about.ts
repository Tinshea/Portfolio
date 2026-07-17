import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

export interface AboutContent {
  description: string;
  stack: string[];
}

// Server-side read of content/about.json (managed via /keystatic).
export async function getAbout(locale: string): Promise<AboutContent> {
  const about = await reader.singletons.about.read();
  const isFr = locale === "fr";
  return {
    // Fall back to the other language so a half-filled entry still works.
    description:
      ((isFr
        ? about?.descriptionFr || about?.descriptionEn
        : about?.descriptionEn || about?.descriptionFr) ?? ""),
    stack: (about?.stack as string[] | undefined) ?? [],
  };
}

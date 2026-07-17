import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import { ExperienceType } from "@/types";

// Server-side reader over content/experiences/*.json and content/formations/*.json
// (managed via /keystatic). Both collections share the same schema and are
// rendered by the same components.
const reader = createReader(process.cwd(), keystaticConfig);

type CareerEntries = Awaited<ReturnType<typeof reader.collections.experiences.all>>;

function toExperienceTypes(entries: CareerEntries, locale: string): ExperienceType[] {
  const isFr = locale === "fr";
  return entries
    .map(({ entry }, index) => ({
      order: entry.order ?? 99,
      item: {
        id: index + 1,
        // Fall back to the other language so a half-filled entry still works.
        title: (isFr ? entry.titleFr || entry.title : entry.title) ?? "",
        company: entry.company,
        description:
          ((isFr
            ? entry.descriptionFr || entry.descriptionEn
            : entry.descriptionEn || entry.descriptionFr) ?? ""),
        date: ((isFr ? entry.dateFr || entry.dateEn : entry.dateEn || entry.dateFr) ?? ""),
        tags: entry.tags as string[],
        logo: entry.logoImage ?? entry.logoUrl ?? undefined,
      },
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ item }) => item);
}

export async function getExperiences(locale: string): Promise<ExperienceType[]> {
  return toExperienceTypes(await reader.collections.experiences.all(), locale);
}

export async function getFormations(locale: string): Promise<ExperienceType[]> {
  return toExperienceTypes(await reader.collections.formations.all(), locale);
}

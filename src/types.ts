import {locales} from './config';

export type Locale = (typeof locales)[number];

export interface ExperienceType {
  id: number;
  title: string;
  company: string;
  description: string;
  date: string;
  tags: string[];
  logo?: string;
}

export interface PinnedRepo {
  name: string;
  description: string;
  forkCount: number;
  stargazerCount: number;
}

export interface ProjectCardProps extends PinnedRepo {
  user: string;
}

export interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
}

export interface BlogPost {
  title: string;
  date: string;
  description: string;
  link: string;
}

export interface FeaturedMedia {
  type: 'image' | 'video' | 'youtube';
  /** Local path (/projects/...) or full URL. For youtube, use the embed URL. */
  src: string;
  caption?: string;
}

/** A featured project block: code or not (homelab, hardware, infra...). */
export interface FeaturedItem {
  name: string;
  description: string;
  tags: string[];
  /** URL segment of the detail page; required when `details` is present. Same value in every locale. */
  slug?: string;
  /** Card visual. Defaults to the GitHub OpenGraph render when `link` points to GitHub. */
  image?: string;
  /** Optional external link (GitHub, demo...). */
  link?: string;
  /** Optional case-study content; when present, clicking the card opens the project's dedicated page. */
  details?: {
    /** Long-form text; blank lines (\n\n) split paragraphs. */
    body?: string;
    media?: FeaturedMedia[];
  };
}

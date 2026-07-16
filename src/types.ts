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
  /** Card visual. Defaults to the GitHub OpenGraph render when `link` points to GitHub. */
  image?: string;
  /** Optional external link (GitHub, demo...). */
  link?: string;
  /** Optional rich detail sheet; when present, clicking the card opens it in a dialog. */
  details?: {
    /** Long-form text; blank lines (\n\n) split paragraphs. */
    body?: string;
    media?: FeaturedMedia[];
  };
}

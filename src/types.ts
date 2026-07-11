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

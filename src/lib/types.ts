export type LinkKind = "github" | "youtube" | "figma" | "devpost" | "link";

export interface Profile {
  name: string;
  tagline: string;
  status: string;
  about: string[];
  resume: string;
  socials: { github: string; linkedin: string; email: string; instagram: string };
}

export interface Job {
  id: string;
  company: string;
  role: string;
  team?: string;
  location: string;
  start: string;
  end?: string;
  dateLabel: string;
  logo?: { src: string; width: number; height: number };
  points: string[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  order: number;
  tags: string[];
  links: Partial<Record<LinkKind, string>>;
}

export interface SiteData {
  profile: Profile;
  jobs: Job[];
  projects: Project[];
  lastUpdated: string;
}

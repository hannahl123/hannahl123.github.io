import { getCollection, getEntry } from "astro:content";
import { formatDateRange } from "./format";
import { getLastUpdated } from "./last-updated";
import type { Job, Project, SiteData } from "./types";

let cached: Promise<SiteData> | undefined;

async function load(): Promise<SiteData> {
  const profileEntry = await getEntry("profile", "main");
  if (!profileEntry) throw new Error("src/content/profile.yaml must contain an entry with id: main");

  const jobs: Job[] = (await getCollection("experience"))
    .map(({ id, data }) => ({
      id,
      company: data.company,
      role: data.role,
      location: data.location,
      start: data.start,
      end: data.end,
      dateLabel: formatDateRange(data.start, data.end),
      logo: data.logo && { src: data.logo.src, width: data.logo.width, height: data.logo.height },
      points: data.points,
    }))
    .sort((a, b) => b.start.localeCompare(a.start));

  const projects: Project[] = (await getCollection("projects"))
    .map(({ id, data }) => ({ slug: id, ...data }))
    .sort((a, b) => a.order - b.order);

  return { profile: profileEntry.data, jobs, projects, lastUpdated: getLastUpdated() };
}

/** The one place that reads content collections; both modes render from this. */
export function loadSiteData(): Promise<SiteData> {
  cached ??= load();
  return cached;
}

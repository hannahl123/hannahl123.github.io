import type { SiteData } from "../lib/types";

export const fixture: SiteData = {
  profile: {
    name: "Hannah Liu",
    tagline: "Software Engineering @ UWaterloo",
    status: "open to summer 2027 internships",
    about: ["Hello!", "Second paragraph."],
    resume: "/Resume_Hannah_Liu.pdf",
    socials: {
      github: "https://github.com/hannahl123",
      linkedin: "https://www.linkedin.com/in/x/",
      email: "a@b.co",
      instagram: "https://www.instagram.com/x/",
    },
  },
  jobs: [
    { id: "ws", company: "Wealthsimple", role: "Software Development Intern", location: "Toronto, ON", start: "2026-09", dateLabel: "Sep 2026 – Present", points: [] },
    { id: "sh", company: "Shopify", role: "SWE Intern", location: "Toronto, ON", start: "2025-05", end: "2025-08", dateLabel: "May – Aug 2025", points: ["Did things"] },
  ],
  projects: [
    { slug: "reflect", title: "Reflect.", description: "Social app", order: 0, tags: [], links: { github: "https://github.com/hannahl123/Reflect" } },
    { slug: "pocket-pantry", title: "Pocket Pantry", description: "Recipes", order: 1, tags: [], links: { devpost: "https://devpost.com/software/x" } },
    { slug: "personal-website", title: "Personal Website", description: "This site", order: 2, tags: [], links: { link: "https://hannahl123.github.io/" } },
  ],
  lastUpdated: "November 2026",
};

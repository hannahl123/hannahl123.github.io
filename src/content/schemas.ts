import { z } from "astro/zod";

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "use YYYY-MM");
const httpUrl = z.url({ protocol: /^https?$/ });

export const linksSchema = z
  .object({
    github: httpUrl.optional(),
    youtube: httpUrl.optional(),
    figma: httpUrl.optional(),
    devpost: httpUrl.optional(),
    link: httpUrl.optional(),
  })
  .strict();

export const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  order: z.number(),
  tags: z.array(z.string()).default([]),
  links: linksSchema.default({}),
});

export const jobFields = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  team: z.string().min(1).optional(),
  location: z.string().min(1),
  start: yearMonth,
  end: yearMonth.optional(),
  points: z.array(z.string().min(1)).default([]),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  status: z.string().min(1),
  about: z.array(z.string().min(1)).min(1),
  resume: z.string().startsWith("/"),
  socials: z.object({
    github: httpUrl,
    linkedin: httpUrl,
    email: z.email(),
    instagram: httpUrl,
  }),
});

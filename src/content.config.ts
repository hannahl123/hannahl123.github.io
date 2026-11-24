import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { jobFields, profileSchema, projectSchema } from "./content/schemas";

const profile = defineCollection({
  loader: file("src/content/profile.yaml"),
  schema: profileSchema,
});

const experience = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/experience" }),
  schema: ({ image }) => jobFields.extend({ logo: image().optional() }),
});

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: projectSchema,
});

export const collections = { profile, experience, projects };

import { describe, expect, it } from "vitest";
import { jobFields, linksSchema, profileSchema } from "./schemas";

describe("linksSchema", () => {
  it("rejects malformed github url", () => {
    expect(
      linksSchema.safeParse({ github: "https.github.com/hannahl123/Life-Simulator" }).success,
    ).toBe(false);
  });

  it("accepts all five link kinds", () => {
    const links = {
      github: "https://github.com/a/b",
      youtube: "https://youtu.be/x",
      figma: "https://www.figma.com/file/x",
      devpost: "https://devpost.com/software/x",
      link: "https://example.com",
    };
    expect(linksSchema.parse(links)).toEqual(links);
  });

  it("rejects unknown link key", () => {
    expect(linksSchema.safeParse({ gitlab: "https://x.io" }).success).toBe(false);
  });
});

describe("jobFields", () => {
  it("allows empty points and no end", () => {
    const job = jobFields.parse({
      company: "Wealthsimple",
      role: "Software Development Intern",
      location: "Toronto, ON",
      start: "2026-09",
    });
    expect(job.points).toEqual([]);
    expect(job.end).toBeUndefined();
  });

  it("rejects bad month format", () => {
    expect(
      jobFields.safeParse({ company: "A", role: "B", location: "C", start: "Sept 2026" }).success,
    ).toBe(false);
  });
});

describe("profileSchema", () => {
  const base = {
    name: "Hannah Liu",
    tagline: "t",
    status: "s",
    resume: "/r.pdf",
    socials: {
      github: "https://github.com/x",
      linkedin: "https://linkedin.com/in/x",
      email: "a@b.co",
      instagram: "https://instagram.com/x",
    },
  };

  it("requires at least one about paragraph", () => {
    expect(profileSchema.safeParse({ ...base, about: [] }).success).toBe(false);
    expect(profileSchema.safeParse({ ...base, about: ["hi"] }).success).toBe(true);
  });
});

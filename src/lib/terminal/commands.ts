import { slugify } from "../format";
import type { Job, Project, SiteData } from "../types";

export type Tone = "default" | "muted" | "pink" | "mint" | "butter" | "error";
export type Block =
  | { type: "text"; text: string; tone?: Tone }
  | { type: "links"; items: { label: string; href: string }[] }
  | { type: "job"; job: Job }
  | { type: "list"; items: string[]; tone?: Tone }
  | { type: "bunny"; mood: "happy" | "love" | "confused" };
export type Effect = { kind: "clear" } | { kind: "open"; href: string };
export interface CommandResult {
  blocks: Block[];
  effect?: Effect;
  track?: "resume";
}

export const COMMANDS = [
  "help",
  "whoami",
  "about",
  "experience",
  "projects",
  "open",
  "resume",
  "contact",
  "clear",
] as const;

const HELP: Record<(typeof COMMANDS)[number], string> = {
  help: "show this list",
  whoami: "who is hannah?",
  about: "a little more about me",
  experience: "where I've worked",
  projects: "things I've built",
  open: "open <project> — details and links",
  resume: "open my resume (pdf)",
  contact: "ways to say hi",
  clear: "clear the screen",
};

const LINK_LABELS: Record<string, string> = {
  github: "GitHub",
  youtube: "YouTube",
  figma: "Figma",
  devpost: "Devpost",
  link: "Website",
};

export function findProject(query: string, projects: Project[]): { match?: Project; candidates: Project[] } {
  const q = slugify(query);
  if (!q) return { candidates: [] };
  const exact = projects.find((p) => p.slug === q || slugify(p.title) === q);
  if (exact) return { match: exact, candidates: [exact] };
  const candidates = projects.filter((p) => p.slug.startsWith(q) || slugify(p.title).startsWith(q));
  return candidates.length === 1 ? { match: candidates[0], candidates } : { candidates };
}

const t = (text: string, tone?: Tone): Block => (tone ? { type: "text", text, tone } : { type: "text", text });

function contactLinks(data: SiteData): Block {
  const s = data.profile.socials;
  return {
    type: "links",
    items: [
      { label: `email   ${s.email}`, href: `mailto:${s.email}` },
      { label: "linkedin", href: s.linkedin },
      { label: "github", href: s.github },
      { label: "instagram", href: s.instagram },
    ],
  };
}

function openResume(data: SiteData, blocks: Block[]): CommandResult {
  return { blocks, effect: { kind: "open", href: data.profile.resume }, track: "resume" };
}

export function runCommand(input: string, data: SiteData): CommandResult {
  const line = input.trim().replace(/\s+/g, " ");
  if (!line) return { blocks: [] };
  const [rawCmd, ...rest] = line.split(" ");
  const cmd = rawCmd.toLowerCase();
  const arg = rest.join(" ");
  const { profile } = data;

  switch (cmd) {
    case "help":
      return {
        blocks: [
          t("available commands:", "muted"),
          ...COMMANDS.map((c) => t(`  ${c.padEnd(11)} ${HELP[c]}`)),
          t("tip: tab completes, ↑/↓ for history", "muted"),
        ],
      };
    case "whoami":
      return {
        blocks: [
          t(profile.name, "pink"),
          t(profile.tagline, "muted"),
          t(`status: "${profile.status}"`, "butter"),
          { type: "bunny", mood: "happy" },
        ],
      };
    case "about":
      return { blocks: [t(profile.name, "pink"), ...profile.about.map((p) => t(p))] };
    case "experience":
      return { blocks: data.jobs.map((job): Block => ({ type: "job", job })) };
    case "projects":
      return {
        blocks: [
          { type: "list", items: data.projects.map((p) => `${p.slug}/`), tone: "mint" },
          t("try: open <project>", "muted"),
        ],
      };
    case "open": {
      if (!arg) return { blocks: [t("usage: open <project>", "muted")] };
      const { match, candidates } = findProject(arg, data.projects);
      if (match) {
        const items = Object.entries(match.links).map(([k, href]) => ({ label: LINK_LABELS[k] ?? k, href: href! }));
        const blocks: Block[] = [t(match.title, "mint"), t(match.description)];
        if (match.tags.length) blocks.push(t(match.tags.join(" · "), "muted"));
        if (items.length) blocks.push({ type: "links", items });
        return { blocks };
      }
      if (candidates.length > 1) {
        return {
          blocks: [
            t(`'${arg}' could be:`, "muted"),
            { type: "list", items: candidates.map((p) => `${p.slug}/`), tone: "mint" },
          ],
        };
      }
      return { blocks: [t(`no project named '${arg}' — try 'projects'`, "error")] };
    }
    case "resume":
      return openResume(data, [t("opening resume.pdf…", "muted")]);
    case "sudo":
      if (arg.toLowerCase() === "hire hannah") {
        return openResume(data, [
          t("permission granted ♥", "butter"),
          { type: "bunny", mood: "love" },
          t("opening resume.pdf…", "muted"),
        ]);
      }
      return { blocks: [t("hannah is not in the sudoers file. this incident will be reported ✿", "error")] };
    case "contact":
      return { blocks: [t("say hi! ✿", "pink"), contactLinks(data)] };
    case "clear":
      return { blocks: [], effect: { kind: "clear" } };
    case "ls":
      return { blocks: [{ type: "list", items: ["about.md", "work.log", "projects/", "resume.pdf"], tone: "mint" }] };
    case "pwd":
      return { blocks: [t("/home/hannah")] };
    case "cd":
      return { blocks: [t("nice try — this terminal only has one room ✿", "muted")] };
    default:
      return { blocks: [t(`command not found: ${cmd} — try 'help'`, "error")] };
  }
}

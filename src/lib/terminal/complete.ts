import { slugify } from "../format";
import type { SiteData } from "../types";
import { COMMANDS } from "./commands";

/** Tab completion: completes the command, or the project name after `open`. */
export function complete(input: string, data: SiteData): { value: string; options: string[] } {
  const lower = input.toLowerCase();
  const openMatch = /^open\s+(.*)$/.exec(lower);
  if (openMatch) {
    const q = slugify(openMatch[1]);
    const options = data.projects.map((p) => p.slug).filter((s) => s.startsWith(q));
    return { value: options.length === 1 ? `open ${options[0]}` : input, options };
  }
  const q = lower.trim();
  const options = COMMANDS.filter((c) => c.startsWith(q));
  return { value: options.length === 1 ? options[0] : input, options: [...options] };
}

import { execSync } from "node:child_process";

const gitDate = () => execSync("git log -1 --format=%cI", { encoding: "utf8" }).trim();

/** Month and year of the latest commit (e.g. "November 2026"); falls back to `now`. */
export function getLastUpdated(run: () => string = gitDate, now: Date = new Date()): string {
  let date = now;
  try {
    const parsed = new Date(run());
    if (!Number.isNaN(parsed.getTime())) date = parsed;
  } catch {
    // not a git checkout (or git missing): use the build date
  }
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

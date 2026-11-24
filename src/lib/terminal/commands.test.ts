import { describe, expect, it } from "vitest";
import { COMMANDS, runCommand, type Block } from "./commands";
import { fixture } from "../../test/fixture";

const text = (blocks: Block[]) =>
  blocks
    .map((b) => (b.type === "text" ? b.text : b.type === "list" ? b.items.join(" ") : ""))
    .join("\n");
const hrefs = (blocks: Block[]) => blocks.flatMap((b) => (b.type === "links" ? b.items.map((i) => i.href) : []));

describe("runCommand", () => {
  it("help lists every command", () => {
    const out = text(runCommand("help", fixture).blocks);
    for (const c of COMMANDS) expect(out).toContain(c);
  });

  it("input is trimmed and case-insensitive", () => {
    expect(runCommand("  HELP  ", fixture)).toEqual(runCommand("help", fixture));
  });

  it("empty input returns no blocks", () => {
    expect(runCommand("   ", fixture).blocks).toEqual([]);
  });

  it("unknown command", () => {
    expect(runCommand("foo bar", fixture).blocks[0]).toEqual({
      type: "text",
      text: "command not found: foo — try 'help'",
      tone: "error",
    });
  });

  it("experience returns one job block per job, newest first", () => {
    const jobs = runCommand("experience", fixture).blocks.filter((b) => b.type === "job");
    expect(jobs.map((b) => b.type === "job" && b.job.company)).toEqual(["Wealthsimple", "Shopify"]);
  });

  it("projects lists every project as slug/ in mint", () => {
    const list = runCommand("projects", fixture).blocks.find((b) => b.type === "list");
    expect(list).toEqual({
      type: "list",
      items: ["reflect/", "pocket-pantry/", "personal-website/"],
      tone: "mint",
    });
  });

  it("open resolves slug, title, case and punctuation", () => {
    for (const q of ["open reflect", "open Reflect.", "open REFLECT"]) {
      expect(hrefs(runCommand(q, fixture).blocks)).toContain("https://github.com/hannahl123/Reflect");
    }
  });

  it("open resolves unique prefix", () => {
    expect(hrefs(runCommand("open pocket", fixture).blocks)).toContain("https://devpost.com/software/x");
  });

  it("open ambiguous prefix lists candidates", () => {
    const { blocks } = runCommand("open p", fixture);
    expect(text(blocks)).toContain("pocket-pantry/");
    expect(text(blocks)).toContain("personal-website/");
    expect(blocks.some((b) => b.type === "links")).toBe(false);
  });

  it("open with no arg or no match", () => {
    expect(text(runCommand("open", fixture).blocks)).toContain("usage: open <project>");
    expect(text(runCommand("open x", fixture).blocks)).toContain("no project named 'x' — try 'projects'");
  });

  it("resume opens pdf and tracks", () => {
    const r = runCommand("resume", fixture);
    expect(r.effect).toEqual({ kind: "open", href: "/Resume_Hannah_Liu.pdf" });
    expect(r.track).toBe("resume");
  });

  it("sudo hire hannah", () => {
    const r = runCommand("sudo hire hannah", fixture);
    expect(r.track).toBe("resume");
    expect(r.effect).toEqual({ kind: "open", href: "/Resume_Hannah_Liu.pdf" });
    expect(text(r.blocks)).toContain("permission granted ♥");
    expect(r.blocks).toContainEqual({ type: "bunny", mood: "love" });
  });

  it("clear returns clear effect", () => {
    expect(runCommand("clear", fixture).effect).toEqual({ kind: "clear" });
  });

  it("whoami includes name and status", () => {
    const out = text(runCommand("whoami", fixture).blocks);
    expect(out).toContain("Hannah Liu");
    expect(out).toContain("open to summer 2027 internships");
  });

  it("contact links use mailto for email", () => {
    expect(hrefs(runCommand("contact", fixture).blocks)).toContain("mailto:a@b.co");
  });

  it("in-character extras don't throw", () => {
    for (const c of ["ls", "pwd", "cd x"]) {
      expect(runCommand(c, fixture).blocks.length).toBeGreaterThan(0);
    }
  });
});

import { describe, expect, it } from "vitest";
import { getLastUpdated } from "./last-updated";

describe("getLastUpdated", () => {
  it("formats the git commit date", () => {
    expect(getLastUpdated(() => "2026-11-20T10:00:00-05:00")).toBe("November 2026");
  });
  it("falls back to now when git throws", () => {
    const run = () => {
      throw new Error("no git");
    };
    expect(getLastUpdated(run, new Date("2026-03-15T12:00:00Z"))).toBe("March 2026");
  });
  it("falls back to now on empty output", () => {
    expect(getLastUpdated(() => "", new Date("2026-03-15T12:00:00Z"))).toBe("March 2026");
  });
});

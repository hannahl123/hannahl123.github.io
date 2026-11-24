import { describe, expect, it } from "vitest";
import { formatDateRange, slugify } from "./format";

describe("formatDateRange", () => {
  it("same year gives the year once", () => {
    expect(formatDateRange("2026-01", "2026-04")).toBe("Jan – Apr 2026");
    expect(formatDateRange("2025-05", "2025-08")).toBe("May – Aug 2025");
    expect(formatDateRange("2021-08", "2021-12")).toBe("Aug – Dec 2021");
  });
  it("different years give both", () => {
    expect(formatDateRange("2025-11", "2026-02")).toBe("Nov 2025 – Feb 2026");
  });
  it("no end means Present", () => {
    expect(formatDateRange("2026-09")).toBe("Sep 2026 – Present");
  });
});

describe("slugify", () => {
  it("strips punctuation and spaces", () => {
    expect(slugify("Reflect.")).toBe("reflect");
    expect(slugify("Lego That Screams When You Step On It")).toBe(
      "lego-that-screams-when-you-step-on-it",
    );
    expect(slugify("  Pocket  Pantry ")).toBe("pocket-pantry");
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "./analytics";

afterEach(() => {
  delete (globalThis as { gtag?: unknown }).gtag;
});

describe("track", () => {
  it("is a no-op without gtag", () => {
    expect(() => track("Clicked Resume")).not.toThrow();
  });

  it("forwards events to gtag", () => {
    const gtag = vi.fn();
    (globalThis as { gtag?: unknown }).gtag = gtag;
    track("Clicked Resume", { event_category: "Conversion" });
    expect(gtag).toHaveBeenCalledWith("event", "Clicked Resume", { event_category: "Conversion" });
  });
});

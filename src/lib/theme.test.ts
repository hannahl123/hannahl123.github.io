import { describe, expect, it } from "vitest";
import { readTheme, writeTheme } from "./theme";

const blocked = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
};

describe("theme", () => {
  it("follows the system when nothing is stored", () => {
    expect(readTheme({ getItem: () => null }, true)).toBe("dark");
    expect(readTheme({ getItem: () => null }, false)).toBe("light");
  });
  it("a stored choice overrides the system", () => {
    expect(readTheme({ getItem: () => "light" }, true)).toBe("light");
    expect(readTheme({ getItem: () => "dark" }, false)).toBe("dark");
  });
  it("ignores unknown stored values", () => {
    expect(readTheme({ getItem: () => "neon" }, false)).toBe("light");
  });
  it("falls back to the system when storage throws", () => {
    expect(readTheme(blocked, true)).toBe("dark");
  });
  it("writeTheme stores under 'theme' and swallows errors", () => {
    const store: Record<string, string> = {};
    writeTheme("light", { setItem: (k, v) => (store[k] = v) });
    expect(store).toEqual({ theme: "light" });
    expect(() => writeTheme("dark", blocked)).not.toThrow();
  });
});

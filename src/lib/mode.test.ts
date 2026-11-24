import { describe, expect, it } from "vitest";
import { readMode, writeMode } from "./mode";

const throwing = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
};

describe("mode storage", () => {
  it("readMode defaults to read when storage throws", () => {
    expect(readMode(throwing)).toBe("read");
  });
  it("readMode returns stored terminal", () => {
    expect(readMode({ getItem: () => "terminal" })).toBe("terminal");
  });
  it("readMode ignores unknown values", () => {
    expect(readMode({ getItem: () => "banana" })).toBe("read");
  });
  it("writeMode swallows storage errors", () => {
    expect(() => writeMode("terminal", throwing)).not.toThrow();
  });
  it("writeMode stores the mode under 'mode'", () => {
    const store: Record<string, string> = {};
    writeMode("terminal", { setItem: (k, v) => (store[k] = v) });
    expect(store).toEqual({ mode: "terminal" });
  });
});

import { describe, expect, it } from "vitest";
import { complete } from "./complete";
import { fixture } from "../../test/fixture";

describe("complete", () => {
  it("completes a command", () => {
    expect(complete("exp", fixture).value).toBe("experience");
  });
  it("completes a project after open", () => {
    expect(complete("open poc", fixture).value).toBe("open pocket-pantry");
  });
  it("single command match", () => {
    expect(complete("p", fixture).options).toEqual(["projects"]);
  });
  it("ambiguous project prefix keeps input and lists options", () => {
    const r = complete("open p", fixture);
    expect(r.value).toBe("open p");
    expect(r.options).toEqual(expect.arrayContaining(["pocket-pantry", "personal-website"]));
  });
});

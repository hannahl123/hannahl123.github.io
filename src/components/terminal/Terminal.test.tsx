import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Terminal from "./Terminal";
import { fixture } from "../../test/fixture";

afterEach(cleanup);

const setup = (onTrack = vi.fn()) => {
  const user = userEvent.setup();
  render(<Terminal data={fixture} onTrack={onTrack} />);
  const input = screen.getByRole("textbox", { name: /command/i });
  const output = screen.getByTestId("terminal-output");
  return { user, input, output, onTrack };
};

describe("Terminal", () => {
  it("renders welcome and six chips", () => {
    setup();
    expect(screen.getByText(/welcome/i)).toBeTruthy();
    const chips = within(screen.getByRole("group", { name: /commands/i })).getAllByRole("button");
    expect(chips.map((c) => c.textContent)).toEqual(["about", "experience", "projects", "resume", "contact", "help"]);
  });

  it("clicking a chip runs it", async () => {
    const { user, output } = setup();
    await user.click(screen.getByRole("button", { name: "experience" }));
    expect(output.textContent).toContain("Wealthsimple");
  });

  it("typing a command and Enter runs it", async () => {
    const { user, input, output } = setup();
    await user.type(input, "help{Enter}");
    expect(output.textContent).toContain("available commands");
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("ArrowUp recalls the previous command", async () => {
    const { user, input } = setup();
    await user.type(input, "whoami{Enter}");
    await user.type(input, "ls{Enter}");
    await user.type(input, "{ArrowUp}");
    expect((input as HTMLInputElement).value).toBe("ls");
    await user.type(input, "{ArrowUp}");
    expect((input as HTMLInputElement).value).toBe("whoami");
  });

  it("Tab completes", async () => {
    const { user, input } = setup();
    await user.type(input, "exp");
    await user.keyboard("{Tab}");
    expect((input as HTMLInputElement).value).toBe("experience");
  });

  it("clear empties the output", async () => {
    const { user, input, output } = setup();
    await user.type(input, "help{Enter}");
    await user.type(input, "clear{Enter}");
    expect(output.textContent).not.toContain("available commands");
  });

  it("resume opens the pdf and tracks", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const { user, input, onTrack } = setup();
    await user.type(input, "resume{Enter}");
    expect(open).toHaveBeenCalledWith("/Resume_Hannah_Liu.pdf", "_blank", "noopener");
    expect(onTrack).toHaveBeenCalledWith("resume");
    open.mockRestore();
  });

  it("output is a polite live region", () => {
    const { output } = setup();
    expect(output.getAttribute("aria-live")).toBe("polite");
  });

  it("clicking output with text selected does not steal focus", async () => {
    const { user, input, output } = setup();
    await user.type(input, "about{Enter}");
    (input as HTMLInputElement).blur();
    const para = within(output).getByText("Hello!");
    const range = document.createRange();
    range.selectNodeContents(para);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);
    para.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(document.activeElement).not.toBe(input);
    sel.removeAllRanges();
  });

  it("tapping output on a touch device does not focus the input", async () => {
    window.matchMedia = ((q: string) => ({ matches: q.includes("coarse"), media: q })) as never;
    const { output, input } = setup();
    output.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(document.activeElement).not.toBe(input);
    delete (window as { matchMedia?: unknown }).matchMedia;
  });

  it("clicking empty terminal space on desktop focuses the input", () => {
    const { output, input } = setup();
    output.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(document.activeElement).toBe(input);
  });

  it("shows a blinking block cursor", () => {
    setup();
    const cursor = screen.getByTestId("cursor");
    expect(cursor.getAttribute("aria-hidden")).toBe("true");
    expect(cursor.className).toContain("cursor-blink");
  });
});


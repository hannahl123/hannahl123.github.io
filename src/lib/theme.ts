export type Theme = "light" | "dark";
export const THEME_KEY = "theme";

/** Stored choice if valid, else the system preference. Never throws. */
export function readTheme(store: Pick<Storage, "getItem"> | undefined, systemDark: boolean): Theme {
  try {
    const v = store?.getItem(THEME_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    // storage blocked: fall through to the system preference
  }
  return systemDark ? "dark" : "light";
}

export function writeTheme(theme: Theme, store?: Pick<Storage, "setItem">): void {
  try {
    (store ?? globalThis.localStorage)?.setItem(THEME_KEY, theme);
  } catch {
    // storage blocked: choice lasts for this page view only
  }
}

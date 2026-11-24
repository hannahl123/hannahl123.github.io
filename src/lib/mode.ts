export type Mode = "read" | "terminal";
export const MODE_KEY = "mode";

type Getter = Pick<Storage, "getItem">;
type Setter = Pick<Storage, "setItem">;

const storage = (): Storage | undefined => {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
};

/** Last mode the visitor chose; "read" if none, unknown, or storage is blocked. */
export function readMode(store: Getter | undefined = storage()): Mode {
  try {
    return store?.getItem(MODE_KEY) === "terminal" ? "terminal" : "read";
  } catch {
    return "read";
  }
}

export function writeMode(mode: Mode, store: Setter | undefined = storage()): void {
  try {
    store?.setItem(MODE_KEY, mode);
  } catch {
    // storage blocked (e.g. Safari private mode): the choice lasts for this page view only
  }
}

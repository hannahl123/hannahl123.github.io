export type TrackEvent = "Clicked Resume" | "Toggled Mode";

type Gtag = (cmd: "event", name: string, params?: Record<string, string>) => void;

/** Send a GA4 event; silently does nothing if gtag is blocked or not loaded. */
export function track(event: TrackEvent, params?: Record<string, string>): void {
  const gtag = (globalThis as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") gtag("event", event, params);
}

export const trackResume = () => track("Clicked Resume", { event_category: "Conversion" });

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parse(ym: string): { year: string; month: string } {
  const [year, month] = ym.split("-");
  return { year, month: MONTHS[Number(month) - 1] };
}

/** "2026-01","2026-04" → "Jan – Apr 2026"; no end → "Sep 2026 – Present". */
export function formatDateRange(start: string, end?: string): string {
  const s = parse(start);
  if (!end) return `${s.month} ${s.year} – Present`;
  const e = parse(end);
  if (s.year === e.year) return `${s.month} – ${e.month} ${e.year}`;
  return `${s.month} ${s.year} – ${e.month} ${e.year}`;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

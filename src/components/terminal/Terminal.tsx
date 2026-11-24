import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { runCommand, type Block, type Tone } from "../../lib/terminal/commands";
import { complete } from "../../lib/terminal/complete";
import type { SiteData } from "../../lib/types";

interface Props {
  data: SiteData;
  onTrack?: (e: "resume") => void;
}

interface Entry {
  id: number;
  input?: string;
  blocks: Block[];
}

const CHIPS = ["about", "experience", "projects", "resume", "contact", "help"] as const;

const TONE: Record<Tone, string> = {
  default: "text-text",
  muted: "text-muted",
  pink: "text-pink",
  mint: "text-mint",
  butter: "text-butter",
  error: "text-[#ff8a9a]",
};

const BUNNY = {
  happy: "  _(\\_/)\n ( •ᴗ• )\n / >✿",
  love: "  _(\\_/)\n ( ♥ᴗ♥ )\n / >✿",
  confused: "  _(\\_/)\n ( •_• )?\n / >✿",
} as const;

function PromptLine({ children }: { children?: ReactNode }) {
  return (
    <span className="whitespace-pre-wrap break-words">
      <span className="text-pink">hannah</span>
      <span className="text-muted">@</span>
      <span className="text-mint">waterloo</span> <span className="text-muted">~ $</span> {children}
    </span>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return <p className={`whitespace-pre-wrap ${TONE[block.tone ?? "default"]}`}>{block.text}</p>;
    case "list":
      return (
        <ul className={`flex flex-wrap gap-x-5 gap-y-1 ${TONE[block.tone ?? "default"]}`}>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "links":
      return (
        <ul className="space-y-0.5">
          {block.items.map((l) => (
            <li key={l.href}>
              <span className="text-muted">→ </span>
              <a
                href={l.href}
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="text-peri underline-offset-4 hover:underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      );
    case "job": {
      const { job } = block;
      return (
        <div className="py-1">
          <p className="flex flex-wrap items-center gap-2">
            {job.logo && (
              <span className="inline-flex size-5 items-center justify-center rounded bg-[#fdfbff] p-0.5">
                <img src={job.logo.src} alt={job.company} className="size-full object-contain" />
              </span>
            )}
            <span className="text-butter">▸ {job.company}</span>
            <span>· {job.role}</span>
            <span className="text-muted">
              {job.dateLabel} · {job.location}
            </span>
          </p>
          {job.points.map((p) => (
            <p key={p} className="pl-4 text-muted">
              - {p}
            </p>
          ))}
        </div>
      );
    }
    case "bunny":
      return (
        <pre aria-hidden="true" className="bunny text-pink leading-tight" data-mood={block.mood}>
          {BUNNY[block.mood]}
        </pre>
      );
  }
}

export default function Terminal({ data, onTrack }: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const [hint, setHint] = useState<string[]>([]);
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [entries]);

  // Focus the prompt when terminal mode is shown, except on touch devices (no surprise keyboard).
  useEffect(() => {
    const focusIfShown = () => {
      const coarse = window.matchMedia?.("(pointer: coarse)").matches;
      if (!coarse && document.documentElement.dataset.mode === "terminal") {
        inputRef.current?.focus({ preventScroll: true });
      }
    };
    focusIfShown();
    window.addEventListener("modechange", focusIfShown);
    return () => window.removeEventListener("modechange", focusIfShown);
  }, []);

  const run = (input: string) => {
    const result = runCommand(input, data);
    if (input.trim()) history.current.push(input.trim());
    cursor.current = history.current.length;
    setHint([]);
    if (result.effect?.kind === "clear") {
      setEntries([]);
    } else {
      setEntries((prev) => [...prev, { id: nextId.current++, input, blocks: result.blocks }]);
    }
    if (result.effect?.kind === "open") window.open(result.effect.href, "_blank", "noopener");
    if (result.track) onTrack?.(result.track);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      if (!h.length) return;
      cursor.current = Math.max(0, Math.min(h.length, cursor.current + (e.key === "ArrowUp" ? -1 : 1)));
      setValue(h[cursor.current] ?? "");
    } else if (e.key === "Tab") {
      if (!value.trim()) return; // let Tab move focus when the line is empty
      e.preventDefault();
      const r = complete(value, data);
      setValue(r.value);
      setHint(r.options.length > 1 ? r.options : []);
    }
  };

  return (
    <section aria-label="Interactive terminal" className="py-6" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-3xl font-bold text-white sm:text-4xl">
            {data.profile.name} <span className="text-pink">✿</span>
          </p>
          <p className="mt-2 text-muted">welcome! type a command, or click one below ↓</p>
        </div>
        <pre aria-hidden="true" className="hidden text-pink leading-tight sm:block">
          {BUNNY.happy}
        </pre>
      </div>

      <div role="group" aria-label="Commands" className="mt-4 flex flex-wrap gap-2">
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              run(c);
            }}
            className="rounded-full border border-card-border px-3 py-1 text-sm text-text transition hover:border-pink hover:text-pink focus-visible:outline-2 focus-visible:outline-pink"
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 min-h-[50vh] rounded-xl border border-card-border bg-card p-4 text-sm leading-relaxed sm:p-5">
        <div data-testid="terminal-output" aria-live="polite" className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="space-y-1">
              <PromptLine>{entry.input}</PromptLine>
              {entry.blocks.map((b, i) => (
                <BlockView key={i} block={b} />
              ))}
            </div>
          ))}
        </div>
        {hint.length > 0 && <p className="mt-3 text-mint">{hint.join("  ")}</p>}
        <label className="mt-3 flex items-center gap-2">
          <span className="sr-only">Terminal command</span>
          <PromptLine />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="go"
            className="min-w-0 flex-1 bg-transparent text-text caret-pink outline-none"
          />
        </label>
        <div ref={endRef} />
      </div>
    </section>
  );
}

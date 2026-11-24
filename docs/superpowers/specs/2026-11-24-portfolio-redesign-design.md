# Portfolio Redesign — Design

Date: 2026-11-24
Branch: `redesign-astro`
Site: https://hannahl123.github.io (GitHub Pages, user site, served from domain root)

## Intent

Hannah's portfolio (React + Vite + Tailwind, two-panel layout with a flower nav) is being
rebuilt for two reasons:

1. **The look.** She wants something fresher and better looking, in a "techy but cute"
   style. After comparing four style directions and several layouts in mockups, she chose
   a **kawaii terminal** look with a **toggle between a readable scrolling page and an
   interactive terminal**.
2. **Upkeep.** Updating the current site means editing four places: experience is
   hardcoded in `Experience.jsx`, projects in `src/data/projects.js`, the "last updated"
   footer date and the internship term in `LeftPanel.jsx`. Adding a job or project should
   become a single text edit.

The audience is recruiters and engineers, especially for her **Summer 2027 internship**
search. A recruiter skimming for 30 seconds has to get who she is, the fact that she's
looking, her resume and her work without any interaction.

## Goals

- Kawaii-terminal visual identity (see Visual style).
- Two modes, **Read** and **Terminal**, rendering the **same content**, with a toggle
  between them.
- All content (profile, jobs, projects, links) lives in content files with a validated
  schema. Adding a job or project means adding one file. The build fails on malformed
  entries such as a bad URL or a missing logo.
- Keep every existing project link type: GitHub, YouTube, Figma, Devpost, generic link.
- Company logos for each job, in both modes.
- Keep Google Analytics, including the resume-click event.
- Fast and accessible. Read mode works with JavaScript disabled.

## Non-goals

- No blog or CMS, and no backend. The site stays static on GitHub Pages.
- No custom domain change.
- No rewrite of the bio or project descriptions beyond fixing errors. Copy migrates
  as-is.

## Anti-goals (a failure even if it works)

- A recruiter lands on the site and has to type or click before seeing anything useful.
  Read mode is the default for exactly this reason.
- The terminal is a gimmick that hides content. Every piece of content must be reachable
  in Read mode.
- Novelty that hurts legibility: tiny low-contrast text, or real content dressed up as
  code. Text must meet WCAG AA contrast.
- Upkeep that is just as painful as before, e.g. content duplicated between the modes.

## Approaches considered

| Approach | Trade-off | Decision |
|---|---|---|
| **Astro** with content collections and a React island for the terminal | Purpose-built for content sites. Zod-validated content. Read mode ships as zero-JS HTML. Still lets her write the interactive part in React/TS. Small new tool to learn. | **Chosen by Hannah** |
| React + Vite, cleaned up (one typed data file, deps pruned) | Familiar tools, but the whole site stays a client-rendered SPA and content validity is on her | Rejected |
| Next.js / SSR frameworks | Built for server features GitHub Pages can't run | Ruled out |

## Decided by Hannah

- Style **B: kawaii terminal**, chosen over pastel retro desktop, soft bento and
  graph-paper notebook.
- **Both** layouts, scrolling "terminal output" page and interactive terminal, with a
  **toggle** between them.
- Keep all current project links.
- Add company logos.
- Astro.

## Proposed by me, accepted in conversation

- Read mode is the default. The chosen mode is remembered in `localStorage`.
- One content source feeds both modes.
- Terminal mode has clickable command chips, so mobile users and non-typers aren't
  stuck, plus a few easter eggs.
- Read mode shows the featured projects plus "see all". `projects` in the terminal lists
  everything.

## Visual style

Reference mockups (built during brainstorming) have this palette and type:

- Background `#1e1b2e`, window chrome `#17142a`, card `#231f37` with border `#3a3460`.
- Text `#e8e3ff`. Muted `#8f87b0`, to be checked for AA on the background and adjusted
  if it fails.
- Accents: pink `#ff9ecf` (prompt, primary accent), mint `#8be0c3` (paths, directories),
  butter `#ffd88a` (strings, company names), periwinkle `#a9b8ff` (keywords).
- Fonts: **JetBrains Mono** for body and UI, **Space Grotesk** bold for the name and
  headings. Self-host both via `@fontsource`, not the Google Fonts CDN.
- Signature details: macOS-style three-dot window bar in pink, butter and mint; a
  blinking pink block cursor; the ASCII bunny mascot holding a flower (`( •ᴗ• )` /
  `/ >✿`), which keeps the flower motif from the current site; `✿` as a recurring glyph.
- Respect `prefers-reduced-motion`: no blinking cursor or typing animation when it is
  set.
- Dark theme only (my call; the whole look is a dark terminal).

## Page structure

Single page at `/`, plus `/projects` for all projects, so "see all" has a shareable URL.

Top bar: window dots on the left, mode toggle `[📖 read | >_ terminal]` on the right.
The toggle is a real button group with `aria-pressed` and is keyboard-operable.

### Read mode (default, server-rendered, no JS required)

Each section is headed by a fake command line (`~ $ <command>`) followed by its output:

1. `whoami` → name (large), tagline ("Software Engineering @ UWaterloo"), status line
   (`"open to summer 2027 internships"`, driven by a profile field), links: resume, GitHub,
   LinkedIn, email, Instagram.
2. `cat about.md` → the three existing About paragraphs.
3. `cat work.log` → one card per job: logo, company, role, dates, location, bullet
   points. Reverse chronological.
4. `ls projects/` → grid of the **featured** projects (title as `name/`, short
   description, tech tags if provided, link icons). Ends with a `see all →` link to
   `/projects`.
5. `contact` → a short "say hi ✿" line and the contact links, rendered from the
   same `socials` data as `whoami`. It's the target of `~/contact` (my call: a closing
   contact block at the bottom is conventional, and the links come from one source, so
   nothing is duplicated in the content).
6. Footer: "last updated <date>" (computed at build time from git, see Content
   model), "built with Astro ✿".

A small section index (`~/about ~/work ~/projects ~/contact`) gives in-page navigation
with the active section highlighted. On mobile it collapses into the top bar.

`/projects` uses the same read-mode styling and lists all projects in content order.

### Terminal mode (React island, client-only)

- Opens with a welcome line, the command chips, and the bunny.
- Commands, all derived from the content collections:
  - `help`: lists commands.
  - `whoami` / `about`: profile and bio.
  - `experience`: jobs with logos inline.
  - `projects`: all project names. `open <name>` shows the description and its links as
    clickable anchors. Name matching is case-insensitive, with slug or tab-completion.
  - `resume`: opens the PDF in a new tab and fires the GA resume event.
  - `contact`: lists contact links.
  - `clear`: clears output.
  - Easter eggs (builder's discretion, keep them light): `sudo hire hannah` opens the
    resume with `permission granted ♥`, the bunny reacts, `ls`, `cd`, `pwd` respond in
    character.
- Unknown command: `command not found: x — try 'help'`.
- Up/down arrow history. Tab completes commands and project names.
- Chips run commands on click. On touch devices the chips are the primary input. The
  text input is still present, but it shouldn't auto-focus and pop the keyboard.
- Output is a live region (`aria-live="polite"`) so screen readers hear the results.
- Switching to Read mode swaps the view without a page reload.

## Content model (Astro content collections, Zod-validated)

```
src/content/
  profile.yaml          # single entry: name, tagline, status (e.g. "open to summer 2027 internships"),
                        #   about (array of paragraphs), resume path, socials {github, linkedin,
                        #   email, instagram}
  experience/
    wealthsimple-2026.md # Sept 2026 – Present (see Data fixes)
    shopify-2026.md     # frontmatter: company, role, start, end (optional = present),
                        #   location, logo (path), order? ; body or `points: []` = bullets
    shopify-2025.md
    biomics-2021.md
  projects/
    doorsense.md        # frontmatter: title, description, featured (bool), order (number),
                        #   tags? [], links { github?, youtube?, figma?, devpost?, link? }
    ...
src/assets/logos/       # shopify.svg, biomics.png (logo images, imported via Astro image())
public/Resume_Hannah_Liu.pdf
```

- Use Astro's `image()` schema helper for `logo` (optional), so a logo path that points to a missing file fails the build.
- Every value in `links` uses `z.string().url()`. This already catches two broken
  existing links (see Data fixes).
- Dates are stored as `YYYY-MM` and formatted for display ("Jan 2026 – Present").
- "Last updated" is the date of the latest commit, read at build time (`git log -1`).
  The deploy checkout needs `fetch-depth: 0`, or the build falls back to the build date.
- A short `CONTENT.md` in the repo root explains how to add a job or project in three
  steps.

## Data fixes during migration

- `Undead Uprising` and `Life Simulator` have malformed GitHub URLs
  (`https.github.com/...`). Correct them to `https://github.com/...`.
- **Experience is out of date.** The Shopify returning internship ended **April 2026**
  (`end: 2026-04`, not "Present"). Add **Wealthsimple · Software Development Intern · Toronto, ON · Sept 2026 – Present** as
  the newest job, with the Wealthsimple logo. Bullet points are not written yet. The file
  holds placeholder bullets inside a `# TODO` comment, and `points` is empty, so the
  card shows company, role, dates and location with no bullets. The schema must allow an
  empty `points` list (my call: no fake text ever goes live).
- `Generative Art` is **removed** (Hannah's call; its GitHub link pointed to the wrong
  repo).
- The `Personal Website` description says "built with HTML, CSS, and JavaScript". Update
  it to mention Astro.
- Featured set: the five that are shown today (Reflect., DoorSense, ShopSmart,
  MarmoGlow, Pocket Pantry) are `featured: true`, in that order.

## Logos

- Shopify and Wealthsimple: use the official logos from each company's brand or press page. Biomics has **no logo** (Hannah's call), so `logo` is optional and
  a job without one renders with no logo tile.
- Shown at about 20–24px next to the company name, inside a small rounded tile, so logos
  of different shapes and colors sit evenly on the dark background. Alt text is the
  company name.
- If Hannah wants a specific logo file, she can drop it into `src/assets/logos/`.

## Analytics

- Keep GA4 property `G-2VXZBYZCJQ` with the plain `gtag.js` snippet. No `react-ga4`.
  Load it so it doesn't block rendering.
- Events: `Clicked Resume` (category `Conversion`) from both modes. A new event for mode
  switches (`Toggled Mode`, label `read` / `terminal`), so she can see whether people use
  the terminal.

## Tech and repo

- Astro (latest stable), TypeScript, `@astrojs/react` for the terminal island, and
  Tailwind CSS v4 via the Vite plugin, since she already uses Tailwind. Icons come from
  `astro-icon` or inline SVGs instead of the Font Awesome CDN.
- Replace the Vite/React app in place on the `redesign-astro` branch. Remove the
  `@google-cloud/vertexai` dependency (unused) and the duplicate Tailwind setup.
- `old-website/` is kept as-is (my call, it's her history). Keep `public/flower.png` as
  the favicon, or replace it with a `✿` SVG favicon (builder's call).
- Deploy: update `.github/workflows/deploys.yml` to build Astro (Node 22, `npm ci`,
  `fetch-depth: 0`, upload `./dist`). Nothing deploys until the branch is merged to
  `main`.
- Tests: Vitest unit tests for the terminal command parser and formatter (pure functions,
  separate from the UI). A production build (`astro build`) must pass, since that is the
  content validation. A Playwright smoke test is optional.
- Meta: title, description and Open Graph tags (name, tagline). An OG image is optional.

## Left to the builder

- Exact spacing, sizes and responsive breakpoints, within the visual style above.
- The terminal's internal architecture (command registry shape, etc.), as long as
  commands are driven by the content collections.
- Which easter eggs to include, beyond `sudo hire hannah`.
- Icon library choice.
- How the section index collapses on mobile.

## Addendum (2026-11-24): light mode

Hannah asked for a light mode and picked **"Lavender haze"** from mockups. This replaces
the "dark theme only" call above.

- Palette: bg `#f4f1ff`, chrome `#ebe6fb`, card `#ffffff`, border `#ddd6f3`, text/title
  `#241f3a`, muted `#6a6385`, pink `#b8336f`, mint `#187a5a`, butter `#8a5a00`,
  periwinkle `#4352c4`. All are ≥4.5:1 on bg and card.
- Default theme follows the visitor's system (`prefers-color-scheme`). A ☾/☀ button next
  to the mode switch overrides it, and the choice is stored in `localStorage` key `theme`.
  It's set before first paint (no flash), works when storage is blocked, and the button
  is hidden without JS (the system theme still applies through CSS).
- The theme applies on every page; the read/terminal switch stays home-only.

## Addendum (2026-11-24): projects only on /projects

Hannah asked to drop the `ls projects/` section from the home page. Projects now appear
only on `/projects` (and through the terminal's `projects` / `open` commands). The
home section index links `~/projects ↗` to that page, and the `featured` flag is removed
from the schema and content because nothing reads it anymore.

# Portfolio Redesign (Astro, kawaii terminal) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the React/Vite portfolio with an Astro site in a kawaii-terminal style. It has a default Read mode (static, scrolling) and a Terminal mode (interactive), both rendered from one set of validated content files.

**Architecture:** Astro content collections (Zod schemas) hold the profile, jobs and projects. `src/lib/site-data.ts` turns them into one plain `SiteData` object. Read mode is server-rendered `.astro` components that read `SiteData`. Terminal mode is a React island that receives `SiteData` as a prop and delegates to a pure command engine (`src/lib/terminal/`). The mode is a `data-mode` attribute on `<html>`, set before first paint by an inline script, so there's no flash.

**Tech Stack:** Astro 7, TypeScript, `@astrojs/react` + React 19, Tailwind CSS v4 via `@tailwindcss/vite`, `@fontsource/jetbrains-mono`, `@fontsource/space-grotesk`, Vitest, GitHub Actions to GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-24-portfolio-redesign-design.md`. Read it before starting any task; the spec wins over this plan if they disagree.

## Global Constraints

- Work on branch `redesign-astro`. Never push or merge to `main`; that's Hannah's call.
- Node `>=22.23.4` (Astro 7 engine floor). The CI uses Node 22.
- Site URL `https://hannahl123.github.io`, served at the root (no `base`).
- Palette: bg `#1e1b2e`, chrome `#17142a`, card `#231f37`, card border `#3a3460`, text `#e8e3ff`, muted `#8f87b0` (raise it until it hits ≥4.5:1 on `#1e1b2e`), pink `#ff9ecf`, mint `#8be0c3`, butter `#ffd88a`, periwinkle `#a9b8ff`.
- Fonts: JetBrains Mono (body/UI), Space Grotesk 700 (name/headings), self-hosted via `@fontsource`. No Google Fonts CDN, no Font Awesome CDN.
- Status copy is exactly `open to summer 2027 internships`.
- Read mode is the default. The mode is stored in `localStorage` key `mode` with values `read` / `terminal`.
- Every piece of content must be visible in Read mode with JavaScript disabled.
- GA4 ID `G-2VXZBYZCJQ`. Events: `Clicked Resume` (category `Conversion`), `Toggled Mode` (label `read` / `terminal`).
- Text contrast WCAG AA. Respect `prefers-reduced-motion` (no blink, no typing animation).
- No placeholder text may render on the page. Wealthsimple `points` stays `[]`.
- Copy migrates verbatim from the current site, except for the Data fixes listed in the spec.
- Leave `old-website/` untouched.

## Review Focus

1. **Awkward project names in `open`:** `open reflect`, `open Reflect.`, `open lego` and `open pocket pantry` must all resolve (case-insensitive slug or unique-prefix match). An ambiguous prefix lists the candidates and doesn't guess. Tests are in Task 5.
2. **Blocked `localStorage`** (Safari private mode, blocked storage): reading or writing the mode throws. The page must still default to Read mode, and the toggle must still switch modes for the session. Tests are in Task 6 (`mode.test.ts`).
3. **Returning visitor whose last mode was Terminal:** no flash of Read mode before Terminal appears. The inline head script sets `data-mode` before paint. Verified in Task 6.
4. **JavaScript disabled:** Read mode content is fully visible, and the toggle and terminal are hidden rather than shown as dead UI. Verified in Task 6.
5. **Messy terminal input:** empty input, whitespace only, `  HELP  `, uppercase commands, unknown commands with arguments. Nothing throws; empty input echoes a bare prompt; unknown input returns `command not found: <cmd> — try 'help'`. Tests are in Task 5.

---

## File Structure

```
astro.config.mjs                 site, react(), tailwind vite plugin
tsconfig.json                    extends astro/tsconfigs/strict, jsx react-jsx
vitest.config.ts                 node env; jsdom for src/components/terminal/**
package.json                     scripts: dev, build, preview, check, test
CONTENT.md                       how to add a job / project (3 steps each)
src/content.config.ts            collections: profile, experience, projects
src/content/schemas.ts           pure Zod schemas (no image()) — unit-testable
src/content/profile.yaml
src/content/experience/*.md      wealthsimple-2026, shopify-2026, shopify-2025, biomics-2021
src/content/projects/*.md        14 projects (Generative Art removed)
src/assets/logos/                wealthsimple.svg, shopify.svg (Biomics has no logo)
src/lib/types.ts                 SiteData, Profile, Job, Project, LinkKind
src/lib/format.ts                formatDateRange, slugify
src/lib/last-updated.ts          getLastUpdated
src/lib/site-data.ts             loadSiteData (only file that calls getCollection)
src/lib/analytics.ts             track(event, params) — safe no-op without gtag
src/lib/mode.ts                  readMode, writeMode (storage-safe)
src/lib/terminal/commands.ts     runCommand, COMMANDS
src/lib/terminal/complete.ts     complete
src/layouts/Base.astro           <head>, fonts, meta/OG, no-flash script, GA, top bar
src/styles/global.css            tailwind import, @theme tokens, mode visibility rules
src/components/TopBar.astro      window dots + ModeToggle
src/components/ModeToggle.astro  button group + small inline script
src/components/read/*.astro      Prompt, Whoami, About, Work, JobCard, Projects, ProjectCard,
                                 ProjectLinks, Contact, SectionIndex, Footer, Bunny
src/components/terminal/Terminal.tsx   React island
src/pages/index.astro
src/pages/projects.astro
public/Resume_Hannah_Liu.pdf, public/favicon.svg (✿)
.github/workflows/deploys.yml
```

Deleted: `index.html`, `vite.config.js`, `tailwind.config.cjs`, `postcss.config.js`, `eslint.config.js`, `src/App.jsx`, `src/App.css`, `src/main.jsx`, `src/index.css`, `src/components/*.jsx`, `src/components/flower.css`, `src/data/projects.js` (only after its content has moved, in Task 2). `README.md` is rewritten.

---

### Task 1: Astro scaffold replacing the Vite app

**Files:**
- Create: `astro.config.mjs`, `tsconfig.json`, `src/layouts/Base.astro`, `src/styles/global.css`, `src/pages/index.astro` (temporary "hello"), `public/favicon.svg`
- Modify: `package.json`, `README.md`, `.gitignore` (add `.astro/`)
- Delete: the Vite/React files listed above, except `src/data/projects.js` and the `.jsx` sources (keep them for reference until Task 2 and Task 4 finish, then delete)

**Interfaces:**
- Produces: `Base.astro` with props `{ title?: string; description?: string }` and a default `<slot />`. It also has a named slot `top` (the top bar is filled in by Task 6). `global.css` defines Tailwind theme tokens `--color-bg`, `--color-chrome`, `--color-card`, `--color-card-border`, `--color-text`, `--color-muted`, `--color-pink`, `--color-mint`, `--color-butter`, `--color-peri`, `--font-mono`, `--font-display`, so classes like `bg-bg`, `text-pink` and `font-display` work.

- [ ] **Step 1:** Replace `package.json` dependencies: remove `react-ga4`, `@google-cloud/vertexai`, `@vitejs/plugin-react`, the eslint packages, `postcss`, `autoprefixer`, `@tailwindcss/postcss` and `tailwindcss@3`. Then install: `npm i astro @astrojs/react react react-dom @tailwindcss/vite tailwindcss @fontsource/jetbrains-mono @fontsource/space-grotesk` and `npm i -D @astrojs/check typescript vitest @types/react @types/react-dom jsdom @testing-library/react`. Scripts: `dev: astro dev`, `build: astro build`, `preview: astro preview`, `check: astro check`, `test: vitest run`. Add `"engines": { "node": ">=22.23.4" }`.
- [ ] **Step 2:** Write `astro.config.mjs` with `site: 'https://hannahl123.github.io'`, `integrations: [react()]` and `vite: { plugins: [tailwindcss()] }`. Write `tsconfig.json` extending `astro/tsconfigs/strict` with `"jsx": "react-jsx"`, `"jsxImportSource": "react"`.
- [ ] **Step 3:** Write `global.css` with `@import "tailwindcss";` and an `@theme` block containing the Global Constraints palette and fonts. Import the fontsource CSS (`@fontsource/jetbrains-mono/400.css`, `/700.css`, `@fontsource/space-grotesk/700.css`) in `Base.astro`. Set body `bg-bg text-text font-mono`. `Base.astro` sets `<html lang="en">`, the title (default `Hannah Liu`), the meta description, OG `og:title`/`og:description`/`og:type=website`, and the favicon `/favicon.svg` (a pink `✿` on a transparent background).
- [ ] **Step 4:** Make `index.astro` a temporary page that renders `<Base><h1 class="font-display text-pink">Hannah Liu</h1></Base>`.
- [ ] **Step 5:** Run `npm run build && npm run check`. Expected: the build succeeds, `dist/index.html` contains `Hannah Liu`, and check reports 0 errors.
- [ ] **Step 6:** Commit: `git commit -m "chore: replace Vite app with Astro scaffold"`.

---

### Task 2: Content collections, schemas, migrated content, logos

**Files:**
- Create: `src/content/schemas.ts`, `src/content.config.ts`, `src/content/profile.yaml`, `src/content/experience/{wealthsimple-2026,shopify-2026,shopify-2025,biomics-2021}.md`, `src/content/projects/*.md` (14 files), `src/assets/logos/*`, `CONTENT.md`, `vitest.config.ts`
- Test: `src/content/schemas.test.ts`
- Delete: `src/data/projects.js`

**Interfaces:**
- Produces (in `schemas.ts`, built with `z` from `astro/zod`):
  - `linksSchema`: an object with optional `github`, `youtube`, `figma`, `devpost`, `link`, each `z.string().url()`. The schema is `.strict()` (unknown keys fail).
  - `projectSchema`: `{ title: string; description: string; featured: boolean (default false); order: number; tags: string[] (default []); links: linksSchema (default {}) }`.
  - `jobFields`: `{ company: string; role: string; location: string; start: /^\d{4}-\d{2}$/; end?: /^\d{4}-\d{2}$/; points: string[] (default []) }`. There is no `logo` here; `content.config.ts` extends it with `logo: image()`.
  - `profileSchema`: `{ name; tagline; status; about: string[] (min 1); resume: string (starts with "/"); socials: { github: url; linkedin: url; email: email; instagram: url } }`.
- Collections (in `content.config.ts`): `profile` = `file('src/content/profile.yaml')` (a YAML array with one entry `id: main`); `experience` = `glob({ pattern: '*.md', base: './src/content/experience' })` with schema `({ image }) => jobFields.extend({ logo: image().optional() })`; `projects` = `glob({ pattern: '*.md', base: './src/content/projects' })` with `projectSchema`. If the Astro 7 API differs from this Astro 5-style content layer, follow the installed version's docs and keep the same collection names and fields.

- [ ] **Step 1: Write the failing tests** in `schemas.test.ts`:
  - `rejects malformed github url`: `linksSchema.safeParse({ github: 'https.github.com/hannahl123/Life-Simulator' }).success === false`
  - `accepts all five link kinds`: a valid URL for each key parses.
  - `rejects unknown link key`: `{ gitlab: 'https://x.io' }` fails.
  - `job allows empty points and no end`: `jobFields.parse({ company:'Wealthsimple', role:'Software Development Intern', location:'Toronto, ON', start:'2026-09' })` gives `points: []` and `end: undefined`.
  - `job rejects bad month format`: `start: 'Sept 2026'` fails.
  - `profile requires at least one about paragraph`.
- [ ] **Step 2:** Run `npx vitest run src/content/schemas.test.ts`. Expected: FAIL (module not found). `vitest.config.ts` uses `environment: 'node'` and an `environmentMatchGlobs`/`projects` override giving `jsdom` to `src/components/terminal/**`.
- [ ] **Step 3:** Implement `schemas.ts` and `content.config.ts` as specified in Interfaces.
- [ ] **Step 4:** Run the same command. Expected: PASS.
- [ ] **Step 5: Migrate content.**
  - `profile.yaml`: name `Hannah Liu`; tagline `Software Engineering @ UWaterloo`; status `open to summer 2027 internships`; `about` = the three paragraphs from the old `src/components/About.jsx`, verbatim; resume `/Resume_Hannah_Liu.pdf`; socials from the old `Contact.jsx` (github `https://github.com/hannahl123`, linkedin `https://www.linkedin.com/in/hannah-liu2006/`, email `liu.hannah136@gmail.com`, instagram `https://www.instagram.com/hannahliu136/`).
  - Experience, using `points` in frontmatter and copy verbatim from the old `Experience.jsx`:
    - `wealthsimple-2026`: Wealthsimple / Software Development Intern / Toronto, ON / start `2026-09` / no end / `points: []`, plus a YAML comment `# TODO(hannah): add 2–4 bullets` above it.
    - `shopify-2026`: Returning Software Engineering Intern / Toronto, ON / `2026-01` → `2026-04` / 4 points.
    - `shopify-2025`: Software Engineering Intern / Toronto, ON / `2025-05` → `2025-08` / 4 points.
    - `biomics-2021`: Biomics Inc. / Web Developer / Remote / `2021-08` → `2021-12` / 1 point.
  - Projects: one file per entry in the old `projects.js`, with slugs from `slugify(title)` (Task 3 defines `slugify`; for now, name files by hand in lowercase-hyphen form, e.g. `reflect.md`, `lego-that-screams-when-you-step-on-it.md`). `order` = the old array index (gaps are fine). `featured: true` for Reflect., DoorSense, ShopSmart, MarmoGlow, Pocket Pantry. Fix the URLs to `https://github.com/hannahl123/Undead-Uprising` and `https://github.com/hannahl123/Life-Simulator`. Skip Generative Art. Change Personal Website's description to: `The website you're looking at, built with Astro, React, and Tailwind CSS. This project has gone through countless updates and upgrades!`. Projects have no body text.
  - Logos: put the official Wealthsimple and Shopify marks (from each company's brand or press page) in `src/assets/logos/`. `biomics-2021.md` has no `logo`. If an official file can't be obtained, stop and tell Hannah instead of inventing one.
- [ ] **Step 6:** Run `npm run build`. Expected: PASS. Then temporarily change one project link to `https.github.com/x` and rerun. Expected: the build FAILS with a Zod URL error. Revert the change.
- [ ] **Step 7:** Write `CONTENT.md` covering: add a project (create `src/content/projects/<slug>.md`, fill in the frontmatter fields, set `featured` and `order`); add a job (create `src/content/experience/<company>-<year>.md`, drop the logo into `src/assets/logos/`, point `logo:` at it with a relative path); update the status line (`profile.yaml` → `status`). Delete `src/data/projects.js`.
- [ ] **Step 8:** Commit: `git commit -m "feat: content collections with validated schemas and migrated content"`.

---

### Task 3: Site data layer and formatting

**Files:**
- Create: `src/lib/types.ts`, `src/lib/format.ts`, `src/lib/last-updated.ts`, `src/lib/site-data.ts`
- Test: `src/lib/format.test.ts`, `src/lib/last-updated.test.ts`

**Interfaces:**
- Produces (`types.ts`):
  - `type LinkKind = 'github' | 'youtube' | 'figma' | 'devpost' | 'link'`
  - `interface Profile { name; tagline; status; about: string[]; resume: string; socials: { github; linkedin; email; instagram } }`
  - `interface Job { id: string; company; role; location; start: string; end?: string; dateLabel: string; logo?: { src: string; width: number; height: number }; points: string[] }`
  - `interface Project { slug: string; title; description; featured: boolean; order: number; tags: string[]; links: Partial<Record<LinkKind, string>> }`
  - `interface SiteData { profile: Profile; jobs: Job[]; projects: Project[]; lastUpdated: string }`. Jobs are sorted by `start` descending; projects by `order` ascending. `lastUpdated` is display text like `November 2026`.
- `format.ts`: `formatDateRange(start: string, end?: string): string`, `slugify(title: string): string`
- `last-updated.ts`: `getLastUpdated(run?: () => string, now?: Date): string`. The default `run` calls `execSync('git log -1 --format=%cI')`. It returns `"<Month> <YYYY>"` (en-US long month) and falls back to `now` when `run` throws or returns an empty or invalid date.
- `site-data.ts`: `loadSiteData(): Promise<SiteData>`. This is the only place that calls `getCollection`/`getEntry`; it maps `logo` (ImageMetadata) to `{src,width,height}` and computes `slug` from the entry `id`.

- [ ] **Step 1: Write the failing tests:**
  - `formatDateRange('2026-01','2026-04') === 'Jan – Apr 2026'`
  - `formatDateRange('2025-05','2025-08') === 'May – Aug 2025'`
  - `formatDateRange('2021-08','2021-12') === 'Aug – Dec 2021'`
  - `formatDateRange('2025-11','2026-02') === 'Nov 2025 – Feb 2026'`
  - `formatDateRange('2026-09') === 'Sep 2026 – Present'`
  - `slugify('Reflect.') === 'reflect'`, `slugify('Lego That Screams When You Step On It') === 'lego-that-screams-when-you-step-on-it'`, `slugify('  Pocket  Pantry ') === 'pocket-pantry'`
  - `getLastUpdated(() => '2026-11-20T10:00:00-05:00') === 'November 2026'`
  - `getLastUpdated(() => { throw new Error() }, new Date('2026-03-15')) === 'March 2026'`
  - `getLastUpdated(() => '', new Date('2026-03-15')) === 'March 2026'`
- [ ] **Step 2:** Run `npx vitest run src/lib`. Expected: FAIL.
- [ ] **Step 3:** Implement `types.ts`, `format.ts` and `last-updated.ts`. Use the separator ` – ` (spaced en dash), use abbreviated en-US months, and give the year once when both dates fall in the same year.
- [ ] **Step 4:** Run `npx vitest run src/lib`. Expected: PASS.
- [ ] **Step 5:** Implement `site-data.ts`. Temporarily render `JSON.stringify((await loadSiteData()).jobs.map(j => j.dateLabel))` in `index.astro`, run `npm run build`, and confirm `dist/index.html` shows `Sep 2026 – Present` first. Remove the temporary output.
- [ ] **Step 6:** Commit: `git commit -m "feat: site data layer and date formatting"`.

---

### Task 4: Read mode (index and /projects)

**Files:**
- Create: `src/components/read/{Prompt,Whoami,About,Work,JobCard,Projects,ProjectCard,ProjectLinks,Contact,SectionIndex,Footer,Bunny}.astro`, `src/pages/projects.astro`
- Modify: `src/pages/index.astro`
- Delete: the remaining old `src/components/*.jsx` and `flower.css`

**Interfaces:**
- Consumes: `loadSiteData()` and the types from Task 3.
- Produces: `index.astro` wraps all read content in `<main id="read">`. Section ids are `about`, `work`, `projects` and `contact`, plus `top` for whoami. `<div id="terminal-root">` is a sibling of `#read` (empty here; Task 6 fills it). `Prompt.astro` takes props `{ cmd: string }` and renders `~ $ <cmd>` with a muted `~ $`. `ProjectLinks.astro` takes props `{ links: Project['links'] }` and renders inline-SVG icon anchors with `aria-label`s of `GitHub`, `YouTube`, `Figma`, `Devpost` and `Website`, plus `target="_blank" rel="noopener noreferrer"`. The resume anchor has `data-track="resume"` (Task 7 hooks it).

- [ ] **Step 1:** Build the sections in the spec's order: `whoami` (name in `font-display`, tagline, status in butter quotes, link row with resume, GitHub, LinkedIn, email and Instagram) → `cat about.md` → `cat work.log` (JobCard: when `logo` exists, a 24px rounded light tile with `alt={company}`, otherwise no tile; `company` in butter, role, `dateLabel` and location in muted, and a bullet list only when `points.length > 0`) → `ls projects/` (featured only: title rendered as `<slug>/` in mint, the description, tags as chips when present, ProjectLinks, then `see all →` linking to `/projects`) → `contact` ("say hi ✿" plus the same socials) → Footer (`last updated {lastUpdated} · built with Astro ✿`). Add `Bunny.astro` (the ASCII bunny in a `<pre aria-hidden="true">`) beside whoami.
- [ ] **Step 2:** `SectionIndex.astro`: a sticky list `~/about ~/work ~/projects ~/contact` linking to the anchors. On viewports narrower than `md` it collapses to a horizontal scroll row under the top bar. Active-section highlighting is a small progressive-enhancement script using IntersectionObserver that sets `aria-current="true"`. Without JS the links still work.
- [ ] **Step 3:** `projects.astro`: same Base, a `Prompt cmd="ls -a projects/"`, and every project in `order` using ProjectCard. Include a `← cd ..` link back to `/`.
- [ ] **Step 4:** Run `npm run build`. Then check `dist/index.html` with grep: it contains `open to summer 2027 internships`, `Wealthsimple`, `Software Development Intern`, `Sep 2026 – Present` and `Jan – Apr 2026`, and does NOT contain `TODO` or `Generative Art`. `dist/projects/index.html` contains `Life Simulator` and `https://github.com/hannahl123/Life-Simulator`. `dist/index.html` contains exactly five project cards (count `data-project`).
- [ ] **Step 5:** Run `npm run preview`, then open `/` and `/projects` at 1280px and 375px widths (use the `run` skill or Playwright for screenshots). Check that the contrast of muted text on bg is ≥ 4.5:1 and adjust the `--color-muted` token if not. Delete the old `.jsx` components and `flower.css`.
- [ ] **Step 6:** Commit: `git commit -m "feat: read mode pages"`.

---

### Task 5: Terminal command engine (pure)

**Files:**
- Create: `src/lib/terminal/commands.ts`, `src/lib/terminal/complete.ts`
- Test: `src/lib/terminal/commands.test.ts`, `src/lib/terminal/complete.test.ts`

**Interfaces:**
- Consumes: `SiteData`, `Project`, `Job` from Task 3.
- Produces:
  ```ts
  type Tone = 'default' | 'muted' | 'pink' | 'mint' | 'butter' | 'error';
  type Block =
    | { type: 'text'; text: string; tone?: Tone }
    | { type: 'links'; items: { label: string; href: string }[] }
    | { type: 'job'; job: Job }
    | { type: 'list'; items: string[]; tone?: Tone }
    | { type: 'bunny'; mood: 'happy' | 'love' | 'confused' };
  type Effect = { kind: 'clear' } | { kind: 'open'; href: string };
  interface CommandResult { blocks: Block[]; effect?: Effect; track?: 'resume' }
  const COMMANDS: readonly string[]; // ['help','whoami','about','experience','projects','open','resume','contact','clear']
  function runCommand(input: string, data: SiteData): CommandResult;
  function findProject(query: string, projects: Project[]): { match?: Project; candidates: Project[] };
  function complete(input: string, data: SiteData): { value: string; options: string[] };
  ```
  Chips in the UI run `about`, `experience`, `projects`, `resume`, `contact` and `help`.

- [ ] **Step 1: Write the failing tests** (build a `fixture: SiteData` in the test file with 3 projects: `Reflect.`, `Pocket Pantry`, `Personal Website`, and 2 jobs):
  - `help lists every command`: the text includes each entry in `COMMANDS` except `clear`, which is listed separately.
  - `input is trimmed and case-insensitive`: `runCommand('  HELP  ', fixture)` deep-equals `runCommand('help', fixture)`.
  - `empty input returns no blocks`: `runCommand('   ', fixture).blocks` deep-equals `[]`.
  - `unknown command`: `runCommand('foo bar', fixture).blocks[0]` deep-equals `{ type:'text', text:"command not found: foo — try 'help'", tone:'error' }`.
  - `experience returns one job block per job, newest first`.
  - `projects lists every project as slug/ in mint`.
  - `open resolves slug, title, case and punctuation`: `open reflect`, `open Reflect.` and `open REFLECT` all produce links whose hrefs include the fixture's GitHub URL.
  - `open resolves unique prefix`: `open pocket` matches Pocket Pantry.
  - `open ambiguous prefix lists candidates`: `open p` returns text containing `pocket-pantry/` and `personal-website/` and no links block.
  - `open with no arg or no match`: returns usage text `usage: open <project>` / `no project named 'x' — try 'projects'`.
  - `resume opens pdf and tracks`: `effect` deep-equals `{kind:'open', href:'/Resume_Hannah_Liu.pdf'}` and `track === 'resume'`.
  - `sudo hire hannah`: `track === 'resume'`, the open effect is the resume, and the blocks include text `permission granted ♥` and `{type:'bunny', mood:'love'}`.
  - `clear returns clear effect`.
  - `in-character extras don't throw`: `ls`, `pwd` and `cd x` each return ≥1 text block.
  - complete: `complete('exp', fixture).value === 'experience'`; `complete('open poc', fixture).value === 'open pocket-pantry'`; `complete('p', fixture).options` deep-equals `['projects']`; `complete('open p', fixture).options` contains both p-slugs and `value` stays `'open p'`.
- [ ] **Step 2:** Run `npx vitest run src/lib/terminal`. Expected: FAIL.
- [ ] **Step 3:** Implement `commands.ts` and `complete.ts`. Split on whitespace. For `open`, the argument is the rest of the line, normalized with `slugify`. Match order: exact slug, then exact `slugify(title)`, then unique prefix. `whoami` and `about` return name, tagline, status and the about paragraphs. `contact` returns a `links` block (the email href is `mailto:`). `ls` lists `about.md work.log projects/ resume.pdf`; `pwd` returns `/home/hannah`; `cd` returns `nice try — this terminal only has one room ✿`.
- [ ] **Step 4:** Run `npx vitest run src/lib/terminal`. Expected: PASS.
- [ ] **Step 5:** Commit: `git commit -m "feat: terminal command engine"`.

---

### Task 6: Terminal island and mode toggle

**Files:**
- Create: `src/lib/mode.ts`, `src/components/terminal/Terminal.tsx`, `src/components/TopBar.astro`, `src/components/ModeToggle.astro`
- Modify: `src/layouts/Base.astro` (no-flash script, top slot), `src/styles/global.css` (mode rules), `src/pages/index.astro` (mount the island)
- Test: `src/lib/mode.test.ts`, `src/components/terminal/Terminal.test.tsx`

**Interfaces:**
- Consumes: `runCommand`, `complete`, the `Block` and `CommandResult` types (Task 5), `SiteData` (Task 3), and `#read` / `#terminal-root` (Task 4).
- Produces:
  - `mode.ts`: `type Mode = 'read' | 'terminal'`; `readMode(storage?: Pick<Storage,'getItem'>): Mode` returns `'read'` on any throw or unknown value. `writeMode(mode: Mode, storage?: Pick<Storage,'setItem'>): void` swallows throws.
  - `Terminal.tsx`: `export default function Terminal(props: { data: SiteData; onTrack?: (e: 'resume') => void })`.
  - DOM contract: `<html data-mode="read|terminal" class="js">`. The toggle buttons are `[data-mode-btn="read"]` and `[data-mode-btn="terminal"]`, each with `aria-pressed`. Switching dispatches `window` event `modechange` with `detail: Mode`.

- [ ] **Step 1: Write the failing tests:**
  - mode: `readMode` returns `'read'` when `getItem` throws; returns `'terminal'` for stored `'terminal'`; returns `'read'` for stored `'banana'`; `writeMode` doesn't throw when `setItem` throws.
  - Terminal (jsdom, Testing Library): renders the welcome line and six chips; clicking the `experience` chip appends output containing a fixture company; typing `help` + Enter appends output; ArrowUp after two commands restores the previous command in the input; Tab on `exp` completes to `experience`; `clear` empties the output; `resume` calls `window.open('/Resume_Hannah_Liu.pdf', '_blank', 'noopener')` (spy) and `onTrack('resume')`; the output container has `aria-live="polite"`.
- [ ] **Step 2:** Run `npx vitest run src/lib/mode.test.ts src/components/terminal`. Expected: FAIL.
- [ ] **Step 3:** Implement `mode.ts` and `Terminal.tsx`. Each submitted line echoes `hannah@waterloo ~ $ <input>` (pink, muted, mint), then renders the result's blocks; `job` blocks show the logo `<img>` inline when present and `links` blocks render as anchors. Don't auto-focus the input when `matchMedia('(pointer: coarse)')` matches. The blinking cursor and the bunny's mood animation are disabled under `prefers-reduced-motion`.
- [ ] **Step 4:** Run the same command. Expected: PASS.
- [ ] **Step 5: Wire the modes.**
  - In `Base.astro` `<head>`, add an `is:inline` script that runs before CSS paint. It replaces `no-js` with `js` on `<html>` (which starts with `class="no-js" data-mode="read"`), then does `try { if (localStorage.getItem('mode') === 'terminal') document.documentElement.dataset.mode = 'terminal' } catch {}`.
  - `global.css`: `.no-js [data-requires-js]{display:none}`; `[data-mode="terminal"] #read{display:none}`; `[data-mode="read"] #terminal-root{display:none}`. The SectionIndex is hidden in terminal mode.
  - `TopBar.astro` (window dots plus ModeToggle) goes in the top slot. ModeToggle has `data-requires-js` and its script: on click, set `dataset.mode`, `writeMode`, update `aria-pressed`, dispatch `modechange`, and `scrollTo(0,0)`.
  - `index.astro` mounts `<Terminal client:load data={siteData} />` inside `#terminal-root` (which also has `data-requires-js`).
- [ ] **Step 6:** Run `npm run build && npm run preview`, then verify in a browser (Playwright):
  - (a) A fresh visit shows Read mode.
  - (b) Toggle to terminal, reload: Terminal shows with no Read flash. Take a screenshot after `domcontentloaded`, before `load`.
  - (c) With JS disabled, Read content is visible and neither the toggle nor the terminal renders.
  - (d) At 375px, the chips work and the keyboard doesn't open on load.
- [ ] **Step 7:** Commit: `git commit -m "feat: terminal mode island and read/terminal toggle"`.

---

### Task 7: Analytics

**Files:**
- Create: `src/lib/analytics.ts`
- Modify: `src/layouts/Base.astro`, `src/components/ModeToggle.astro`, `src/pages/index.astro`, `src/pages/projects.astro`
- Test: `src/lib/analytics.test.ts`

**Interfaces:**
- Produces: `track(event: 'Clicked Resume' | 'Toggled Mode', params?: Record<string,string>): void`. It calls `window.gtag('event', event, params)` when `gtag` exists, otherwise does nothing.

- [ ] **Step 1: Write the failing tests:** `track` with no `window.gtag` doesn't throw. With a spy `gtag`, `track('Clicked Resume', { event_category: 'Conversion' })` calls it with `('event', 'Clicked Resume', { event_category: 'Conversion' })`.
- [ ] **Step 2:** Run `npx vitest run src/lib/analytics.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement `track`. In `Base.astro`, add the standard gtag snippet for `G-2VXZBYZCJQ` (`async` script plus an inline config). Hook up the events: `[data-track="resume"]` clicks send `track('Clicked Resume', { event_category: 'Conversion' })`; the Terminal island's `onTrack` does the same; the ModeToggle sends `track('Toggled Mode', { event_label: mode })`.
- [ ] **Step 4:** Run the tests. Expected: PASS. Then run `npm run build` and confirm `grep -c G-2VXZBYZCJQ dist/index.html` is ≥ 1.
- [ ] **Step 5:** Commit: `git commit -m "feat: GA4 analytics with resume and mode events"`.

---

### Task 8: Deploy workflow and final verification

**Files:**
- Modify: `.github/workflows/deploys.yml`, `README.md`

- [ ] **Step 1:** Update the workflow: rename it to `Deploy Astro site`, use `actions/checkout@v4` with `fetch-depth: 0`, `actions/setup-node@v4` with `node-version: 22` and `cache: npm`, then run `npm ci`, `npm test` and `npm run build`, and upload `./dist`. The trigger stays `push` to `main`, so nothing deploys from this branch.
- [ ] **Step 2:** Rewrite `README.md`: a one-paragraph description, `npm run dev|build|test`, a pointer to `CONTENT.md`, and the deploy note.
- [ ] **Step 3:** From a clean state, run `rm -rf node_modules dist && npm ci && npm test && npm run check && npm run build`. Expected: all tests pass, `check` reports 0 errors, and the build succeeds.
- [ ] **Step 4:** Commit: `git commit -m "ci: deploy Astro build to GitHub Pages"`.

# hannahl123.github.io

Hannah Liu's portfolio: a cute little terminal ✿. It has a **read** mode (a normal
scrolling page, and the default) and an interactive **terminal** mode
(`help`, `experience`, `open reflect`, `sudo hire hannah`, …). Both modes are built
from the same content files.

Built with [Astro](https://astro.build), React (terminal only), and Tailwind CSS.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm test         # unit tests (Vitest)
npm run check    # type-check
npm run build    # production build → dist/ (also validates all content)
```

## Update content

See [CONTENT.md](CONTENT.md). Jobs, projects, bio and links live in `src/content/`.

## Deploy

Pushing to `main` runs `.github/workflows/deploys.yml`, which tests, builds and
publishes to GitHub Pages. Other branches never deploy.

`old-website/` is the original HTML/CSS version, kept for history.

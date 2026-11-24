# Updating the site

All content lives in `src/content/`. You never need to touch components to update it.
`npm run build` checks every file, and the build fails with a clear message if a
field is missing or a link is malformed.

## Add a project

1. Create `src/content/projects/<project-name>.md` (lowercase, hyphens), e.g. `my-app.md`.
2. Fill in the frontmatter:

   ```yaml
   ---
   title: "My App"
   description: "One or two sentences about what it is and what you built it with."
   order: 20         # lower numbers come first
   tags: ["react", "typescript"]   # optional
   links:            # any of: github, youtube, figma, devpost, link
     github: "https://github.com/hannahl123/my-app"
   ---
   ```

3. Commit and push to `main`. The site redeploys automatically.

## Add a job

1. If the company has a logo, put it in `src/assets/logos/` (SVG or PNG).
2. Create `src/content/experience/<company>-<year>.md`:

   ```yaml
   ---
   company: "Company"
   role: "Software Engineering Intern"
   location: "Toronto, ON"
   start: "2027-05"     # YYYY-MM
   end: "2027-08"       # leave out while it's ongoing → shows "Present"
   logo: "../../assets/logos/company.svg"   # optional
   points:
     - "What you built, and the impact it had"
   ---
   ```

3. Commit and push. Jobs are sorted newest first automatically.

## Change the status line, bio, or links

Edit `src/content/profile.yaml`. `status` is the "open to …" line at the top.

## Replace the resume

Overwrite `public/Resume_Hannah_Liu.pdf`, keeping the same filename.

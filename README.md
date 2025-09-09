# Docsify Blog - Ready to Deploy

This repository is a minimal, ready-to-deploy **Docsify** blogging site.  
It uses Docsify's client-side rendering and GitHub Pages for hosting.

## What's included
- `index.html` — Docsify bootstrap (loads docs from `/docs`)
- `docs/` — markdown content (home, posts, navbar, sidebar)
- `docs/styles.css` — small custom styling
- `.nojekyll` — prevents GitHub Pages from ignoring files/dirs starting with `_`

## How to deploy to GitHub Pages
1. Create a new GitHub repository (public or private).
2. Push the contents of this project to the repository root.
3. In GitHub repo settings -> Pages, set the source to the `main` branch (root) or `gh-pages` branch.
4. Wait a minute — your blog will be available at `https://<username>.github.io/<repo>/`

If you prefer to serve from the `docs/` folder, move `index.html` into `docs/` and select `docs/` as the Pages source.

## Quick edits
- Add posts under `docs/posts/` as `YYYY-MM-DD-title.md` for ordering.
- Edit `docs/_sidebar.md` to control the sidebar links.
- Modify `docs/styles.css` for custom styles.

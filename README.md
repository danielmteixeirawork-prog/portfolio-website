# Portfolio

Personal portfolio of Daniel Teixeira — a static site (plain HTML/CSS/JS, no build step)
deployed on GitHub Pages.

**Live:** https://danielmteixeirawork-prog.github.io/portfolio-website/

## Structure

| Path | What it holds |
|---|---|
| `index.html` | The single-page site: hero, about, project cards, stack, contact. |
| `projects/*.html` | One case study per work project — stack by layer, architecture diagram, security model, technical highlights and metrics. |
| `css/style.css` | All styling. Colours are CSS custom properties in the `:root` block at the top (light theme), redefined under `@media (prefers-color-scheme: dark)` and `[data-theme="dark"]`. |
| `js/script.js` | Theme toggle and footer year. No build tooling, no dependencies. |

### Case studies

- [`projects/mms-platform.html`](projects/mms-platform.html) — DCIM and physical-security platform
- [`projects/ems-platform.html`](projects/ems-platform.html) — multi-site infrastructure monitoring platform
- [`projects/gt-gest.html`](projects/gt-gest.html) — internal stock, tasks and customer management
- [`projects/kiosk-manager.html`](projects/kiosk-manager.html) — kiosk fleet device management
- [`projects/ems-discovery.html`](projects/ems-discovery.html) — network discovery and backup field tool

## Editing

Adding a project means two things: a card in the `work/` or `personal/` grid in
`index.html`, and — for work projects — a new page in `projects/` copied from an existing
one. The case-study pages share the same markup vocabulary:

- `.case-header` / `.tldr` — title, one-line summary, tag list, and the short pitch
- `.stack-table` — two-column "layer → technologies" table
- `.data-table` inside `.table-scroll` — tables with a header row
- `.diagram` — a `<pre>` block for ASCII architecture diagrams and directory trees
- `.metrics` / `.metric` — the numeric tiles
- `.bullets` — the arrow-marked lists

Keep the whole site in English.

## Deployment

GitHub Pages builds from the `main` branch, `/` (root). Every push to `main` redeploys the
site automatically, usually within a minute or two. Nothing to build, nothing to install.

# School Website Template

White-label school/college website built with Eleventy, Nunjucks, plain CSS and minimal vanilla JS. No client-side framework; every page is pre-rendered HTML.

## Commands
```
npm install
npm run dev     # local server with live reload
npm run build   # output to /dist
```

## Where things live
- `src/_data/site.json`: all branding, colors, fonts, contact and SEO defaults
- `src/_data/navigation.json`: menu and footer links
- `src/_includes/components`: reusable partials and macros
- `src/assets/css`: tokens, base, components, pages (bundled to one file)
- `docs/DATA-MODELS.md`: future database fields

## Status
Phases 1–2 complete (architecture, branding data, design system, header/footer). Review the design system at `/design-system/` while running `npm run dev`. Remaining pages and the full guides arrive in later phases.

# Dwaraknath Balaji — AI engineering portfolio

A static editorial portfolio with a photographic, scroll-driven WebGL hero. Charcoal, off-white, metallic blue, Manrope, fine rules and conceptual technical artwork retain the original identity. The face is the owner's real photograph; it is never rendered as an avatar or generated texture.

## Develop and verify

Use Node 24 LTS and the committed lockfile.

```sh
npm ci
npm run dev
npm run check
npm run preview -- --host 127.0.0.1 --port 4173
npm run qa:browser
```

`check` runs type checking, ESLint, production build/prerender, Node tests and bundle budgets. Individual commands: `npm run typecheck`, `npm run lint`, `npm run build`, `npm test`, `npm run size`. Run the build before tests, because tests verify its HTML.

Browser QA uses installed Chrome and Node's built-in WebSocket/CDP support, without Playwright or browser downloads. Defaults to `http://127.0.0.1:4173`; override with `PORTFOLIO_URL`. Set `CHROME_BIN` on nonstandard systems. Reports/screenshots go to `.qa/` (or `QA_OUTPUT`). It checks all eight requested widths, ten additional short/tall/breakpoint combinations, native disclosures, focus, menu Escape, anchors, contact destinations, image loading, overflow, normal/reduced motion, scroll stages, idle rendering, context loss, WebGL failure, no-JavaScript HTML and 200% desktop zoom equivalent (halved CSS viewport with doubled device scale). This does not substitute for human screen-reader testing or a physical mobile-device lab.

GitHub Actions uses Node 24, `npm ci`, `npm run check`, an installed headless Chrome and a production preview server. Failure artifacts contain QA JSON and screenshots. No credentials are needed for CI validation.

## Architecture

- `src/data/portfolio.ts`: strict, readonly identity, navigation, project, experience and contact types/content.
- `src/sections/`: semantic HTML for Hero, About, Expertise, Projects, Experience, Capabilities, Philosophy and Contact.
- `src/hooks/hero-progress.ts`: pure normalized stage mapping, covered by tests.
- `src/hooks/useHeroProgress.ts`: cached hero measurements, passive scroll listener, refs and CSS variables. React state is not updated per scroll event.
- `src/components/three/HeroCanvas.tsx`: lazy optional enhancement, WebGL support check, error boundary, context-loss fallback and visibility control.
- `src/components/three/HeroScene.tsx`: on-demand rendering, constrained pointer interpolation, scroll-controlled depth and geometry.
- `src/components/three/IntelligenceField.tsx`: thin metallic orbital geometry, connected nodes and restrained transparent planes. No textures, shadows, postprocessing, physics, Drei or particle system.
- `src/components/ui/Reveal.tsx`: IntersectionObserver/CSS entrances. Content is visible before enhancement.
- `src/styles/`: base tokens/reset, hero composition, sections/responsive rules, motion, header and retained CSS project artwork.
- `src/entry-server.tsx` + `scripts/prerender.mjs`: build-time React rendering into `dist/index.html`; `src/main.tsx` hydrates it. No server runtime is deployed.

## Hero sequence

A normal document section becomes 250svh with a sticky 100svh stage only on desktops at least 1024px wide and 700px tall with no motion reduction. There is no wheel/touch interception, scroll snapping or artificial scrollbar.

| Progress | Behavior |
| --- | --- |
| 0–10% | Real portrait and name, quiet spatial environment |
| 10–35% | AI, then ENGINEER, rise through 115% overflow masks |
| 35–55% | Geometry gathers and positioning statement appears |
| 50–75% | Calls to action and technology line appear |
| 75–100% | Composition settles; ordinary scrolling continues into About |

Overall, portrait, title, AI, engineer, introduction, CTA, geometry and exit values are separately normalized. CSS and Three consume the same controller. Pointer movement is constrained to small rotations and interpolation requests end once settled. The canvas uses `frameloop="demand"`, a capped DPR, no perpetual animation, and pauses offscreen/when hidden. Declarative Fiber resources are disposed on unmount. A context loss removes the canvas permanently for that page visit.

The portrait is a responsive HTML `picture`, not a WebGL texture. Canvas is decorative, transparent, excluded from accessibility, and occupies preallocated space. The photograph remains when WebGL is unavailable. Main content loads before the delayed 3D import. Essential text, contact links and navigation never live in the canvas.

Phones use a complete static composition with no 3D download or pointer effects. Tablets use the shorter complete composition. Short desktop windows also avoid the sticky sequence. Reduced motion skips the 3D enhancement, smooth scrolling, sticky sequence and nonessential animation; all hero content appears immediately. With JavaScript disabled, complete prerendered content and native disclosures remain usable, including a dedicated navigation fallback.

Keyboard focus within the hero reveals its staged content immediately. The page has one H1, a working skip link, landmarks, visible focus, meaningful portrait alt text, explicit new-tab labels, native disclosures and mobile Escape/focus restoration. Capabilities is linked from the footer to keep primary navigation at six items.

## Edit content without inventing evidence

All owner content belongs in `src/data/portfolio.ts`. Project records support title/status/type, objective, context, role, responsibilities, architecture, technical approach, decisions, constraints, challenges, evaluation method, verified outcomes, stack, media and optional repository/demo/case-study URLs. All three remain **Project direction**. Proposed designs are labeled as proposals; there are no claimed implemented outcomes.

Experience supports company, primary/additional roles, dates, current status, location, summary, responsibilities, contributions, verified outcomes, technologies and company URL. Missing dates/current status are not inferred. Optional details render only when populated. Contacts explicitly store ID, kind, label, href, display value, external behavior and accessible label; labels do not control behavior.

See [CONTENT_NEEDED.md](CONTENT_NEEDED.md) for owner-supplied facts still needed. The existing employment descriptions are preserved source content, not independently verified claims.

## Reproduce assets

```sh
npm run assets
node scripts/social-preview.mjs
```

Sharp reads the untouched root `dwaraknath-portrait.png`, resizes to 480/800/1122px, emits WebP quality 80 (effort 6) and mozjpeg quality 82. It does not retouch facial features. Browser CSS supplies grayscale/tonal treatment. The generator only removes the source duplicate after byte-hash equality; it never deletes the original. Legacy nonidentical JPEGs in `src/assets` remain recoverable and are not bundled.

The social script uses local Chrome to render a 1200×630 composition with the actual portrait and embedded Manrope, then Sharp encodes JPEG quality 88. It does not request external assets. Review `public/social-preview.jpg`. Portrait derivatives, social preview and icons are committed, so CI/hosting builds do not need Chrome for asset generation.

## SEO and static deployment

The build adds full portfolio HTML, Person JSON-LD, Open Graph/Twitter metadata, icons and `robots.txt`. `VITE_SITE_URL` is the only production-origin setting: a plain HTTPS origin, without a path, credentials, query or fragment. Without it, canonical, absolute social image URL, profile URL and sitemap are omitted rather than fabricated. When set, canonical/OG URL/social image and `sitemap.xml` use that origin. This is one page; section anchors are not separate sitemap URLs.

`vercel.json` configures Vite, `npm run build`, `dist`, immutable caching for hashed assets and basic response security headers. No rewrites or server runtime are needed. No backend, forms, analytics, cookies, authentication or database are added.

Deployment procedure:

```sh
npx vercel login
npx vercel deploy --yes
# Read the real preview URL and test it; inspect the project's real production alias.
# Set VITE_SITE_URL to that HTTPS production origin in Vercel's Production environment.
npx vercel env add VITE_SITE_URL production
npx vercel deploy --prod --yes
# Test the exact returned production URL, including metadata and fallbacks.
```

Do not substitute an invented domain. Current authentication status and verification outcome are recorded in UPGRADE_AUDIT.md. No production URL is claimed until deployment is reachable. Avoid paid-plan selection or domain purchases.

## Performance

See [PERFORMANCE.md](PERFORMANCE.md) for baseline/final bytes and methodology. Main JS is smaller after removing Framer Motion, but Three/Fiber introduces a substantial optional chunk. Deferred does not mean free: eligible desktop users download and parse that chunk. Phones/reduced-motion devices skip it; offscreen and idle rendering stop. No WebGL portrait texture means no second portrait download. The font is one local Latin WOFF2. Build output has an honest large-chunk warning for the optional renderer; do not increase the warning threshold to disguise it.

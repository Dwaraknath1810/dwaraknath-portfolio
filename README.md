# Dwaraknath Balaji — AI Engineer

A static React/TypeScript portfolio with a cinematic photographic hero and a charcoal editorial identity. The supplied photograph, Manrope variable font, metallic-blue accents, section numbering, and conceptual project artwork remain central to the design. No backend, rendering library, CMS, authentication, analytics, cookies, or contact form is used.

## Run and verify

Use Node **22.12+** (Node 24 LTS recommended) and the committed npm lockfile.

```sh
npm ci
npm run dev             # Vite development server
npm run check           # TypeScript, ESLint, production build, Node tests
npm run qa:browser      # production Chrome QA; starts and stops its own preview
npm run size            # byte/gzip inventory and initial-payload estimates
npm run preview         # manually inspect dist/
```

`npm run build` type-checks, builds the browser bundle, prerenders all sections, validates content, and writes SEO files. `npm test` expects a current build. `npm run typecheck` and `npm run lint` are available separately. Development uses the normal Vite SPA workflow; no-JavaScript functionality and production SEO must be checked with the production build.

Browser QA uses an installed Chrome and Node's built-in WebSocket API. No browser framework or downloaded browser dependency is added. macOS defaults to `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`; Linux defaults to `/usr/bin/google-chrome`. Set `CHROME_PATH` to another installed Chrome executable if needed. `PORTFOLIO_URL` tests an already running server instead of starting the default `127.0.0.1:4173` production preview. Reports and screenshots go to ignored `.qa/`.

## Architecture

- `src/data/portfolio.ts`: strict content types and all factual portfolio content.
- `src/data/site.ts`: title, description, social-image path and alternative text.
- `src/sections/`: Hero, About, Expertise, Projects, Experience, Capabilities, Philosophy, Contact.
- `src/components/layout/`: responsive header and footer.
- `src/components/ui/`: visible-by-default Reveal, native ProjectDetails, ContentLink, SectionLabel, and existing CSS ProjectArtwork.
- `src/hooks/useHeroMotion.ts`: event-driven scroll and pointer controller.
- `src/styles/`: base tokens/reset/shared typography, sections, shared responsive rules, hero, motion, header, and artwork. `global.css` establishes the shared import order.
- `src/entry-server.tsx`: React renderer used **only during the build**. `src/main.tsx` hydrates generated HTML, or mounts the development SPA.
- `scripts/build.mjs`: Vite client/temporary SSR builds, content validation, HTML generation, robots and sitemap generation. Temporary `.prerender/` output is removed and never deployed.
- `scripts/browser-check.mjs`, `browser-scenarios.mjs`, `chrome.mjs`: reusable Chrome DevTools Protocol verification.
- `scripts/*.test.mjs`: content validation, SEO configuration, generated HTML/assets, and JavaScript budget tests.
- `.github/workflows/verify.yml`: `npm ci`, complete checks, Chrome QA, and report/screenshot artifacts on pushes and pull requests.

No server process or SSR runtime is required to serve the site: deploy **only `dist/`**.

## Content editing

Edit `src/data/portfolio.ts`, run `npm run check`, then inspect `npm run qa:browser`. Missing facts are listed in [CONTENT_NEEDED.md](CONTENT_NEEDED.md). Omit unavailable optional fields; do not insert empty strings, filler achievements, placeholder URLs, `N/A`, or `Unknown`. The build rejects invalid dates, reversed/current-ended timelines, empty strings, invalid navigation targets, and placeholder external URLs.

### Projects

Required fields: `number`, `title`, `description`, `focus`, `kind` (concept-art selection), and `status`. Status supports `Project direction`, `In progress`, and `Completed`; the three supplied entries intentionally remain project directions.

Optional fields: `projectType`, `objective`, `context`, `role`, `responsibilities`, `architecture`, `technicalApproach`, `decisions`, `constraints`, `challenges`, `evaluation`, `outcomes`, `stack`, `media`, `repositoryUrl`, `demoUrl`, and `caseStudyUrl`. Arrays hold individual statements. Media entries require `src`, `alt`, `width`, and `height`; `caption` is optional. Use local optimized images when possible. HTTPS repository/demo links and HTTPS or root-relative case-study destinations are supported; create the actual static destination before linking it.

The overview remains concise. A native `<details>` expands the engineering approach and any supplied technical material; unused groups never render. Conceptual approaches are labeled **Proposed technical approach**. A quiet “Detailed case study in preparation” state appears without a detailed-case-study URL. Repository/demo links appear only when supplied. No metrics or deployments were invented.

### Experience

Required fields: `company`, `primaryRole`, and `current`. Optional fields: `additionalRoles`, `startDate`, `endDate`, `location`, `summary`, `responsibilities`, `contributions`, `highlights`, `technologies`, and `companyUrl`. Dates accept `YYYY-MM` or `YYYY-MM-DD` and display month/year. Roles, prose, contributions, and technology tags have distinct presentation. The existing focus material was regrouped without adding claims; dates and measurable impact await owner input.

### Contacts and navigation

Contact entries contain explicit `id`, `kind`, `label`, `href`, `displayValue`, `external`, and `accessibleLabel`. The discriminated union pairs `email` with `mailto:`/same-tab behavior and `profile` with HTTPS/new-tab behavior. Rendering never infers functionality from labels. External links announce the new tab and use `noopener noreferrer`.

`sectionIds` constrains navigation IDs; production tests resolve every hash target. Capabilities has `id="capabilities"` and a footer link. It is intentionally omitted from the six-link primary navigation to retain the uncluttered header. Mobile numbering matches the actual section numbers, including the gap before Philosophy.

## Cinematic photo hero

The hero is a normal document section with a sticky, approximately one-viewport stage. Desktop motion uses **210svh** of document space. Phones up to 640px wide use the complete static composition so text and actions are immediately readable. The real rectangular photograph is layered with restrained background light, an orbital framing line, typography, gradients and a static atmospheric texture. No cutout or synthetic face was created. The face is neither regenerated nor retouched.

The controller calculates:

```text
progress = clamp((scrollY - sectionDocumentTop) / (sectionHeight - stageHeight), 0, 1)
portrait = clamp(progress / 0.75, 0, 1)
title    = clamp((progress - 0.10) / 0.25, 0, 1)
AI       = clamp((progress - 0.10) / 0.15, 0, 1)
ENGINEER = clamp((progress - 0.18) / 0.17, 0, 1)
intro    = clamp((progress - 0.35) / 0.25, 0, 1)
CTA      = clamp((progress - 0.50) / 0.25, 0, 1)
exit     = clamp((progress - 0.75) / 0.25, 0, 1)
```

The controller exposes separate `--portrait-stage`, `--title-stage`, `--intro-stage`, `--cta-stage`, and `--exit-stage` custom properties, plus individual AI/ENGINEER sub-stages. At zero progress only the photograph, name, framing labels, and exploration link are visible. AI then ENGINEER travel upward from 115% beneath overflow-hidden line masks, with opacity tied to progress. The positioning statement enters at 35–60%; CTAs and supporting line enter at 50–75%. By 75% everything is revealed; the final quarter settles the portrait and dims decorative light before the sticky stage releases into About. Continuing ordinary scrolling reaches About without snapping, interception or forced navigation.

All content is present in the static HTML and visible by default. Only the initialized desktop enhancement applies masks and opacity. Keyboard focus anywhere inside the hero immediately reveals its text and actions, so Tab never lands on an invisible button. Hidden CTAs cannot receive pointer clicks before the reveal completes. The exploration link remains available throughout, and no content is removed from the accessibility tree.

Cached layout measurements refresh on meaningful viewport/element resize. Scroll events are passive, and one requested animation frame batches transform writes. No scroll progress is stored in React state. Desktop pointer targets are clamped to `[-1, 1]`, interpolated at 12% per frame, and stop scheduling frames when settled. Portrait translation is at most 6px horizontally / 4px vertically from pointer motion, with at most 0.65° of tilt. Pointer leave eases to neutral. Offscreen and hidden-tab updates pause. There is no permanent frame loop or continuous particle animation.

### Fallbacks

- At widths up to 640px, a polished static composition replaces the sequence; all text and actions are immediately visible. Pointer effects and the decorative orbital layer are disabled. No blur filter is used.
- Viewports below 700px high use normal static document flow so zoomed and landscape users can reach everything.
- Reduced motion disables sticky sequencing, animated scaling, parallax, tilt, and section entrances. All information is immediately visible.
- Without JavaScript, the production HTML contains the full portfolio, real image, functional links, native disclosures, and a native mobile navigation disclosure.
- Without IntersectionObserver, the hero and section reveals stay static. Unsupported sticky positioning also retains the static layout. The image and essential text have no hidden initial state.
- Reveal uses a single observed CSS entrance and disconnects afterward. No timer is required for reveals.

## Accessibility

One H1 and main landmark, ordered section headings, skip link, visible keyboard focus, stable native disclosures, 44px main interaction targets, Escape dismissal/focus restoration, and focus movement to selected mobile sections are retained or improved. Essential labels now use at least 11px; tiny text is limited to decorative, `aria-hidden` concept art. Decorative hero layers are noninteractive and hidden from assistive technology. Text remains selectable. Responsive picture dimensions reserve space, and screenshot/DOM checks cover reflow and overflow.

## Portrait and brand assets

`dwaraknath-portrait.png` is the untouched 1122×1402 high-resolution source (1,778,210 bytes). The byte-identical unused `src/assets/` PNG copy was removed. The original never enters `dist/`.

```sh
npm run assets:portraits
node scripts/brand-assets.mjs
```

The Sharp portrait script resamples the original with no retouching and creates WebP at 480, 768, and 1122px (quality 82, effort 6) plus reliable JPEG at 576 and 1122px (quality 80, mozjpeg). Sharp is a development-only asset tool and is not part of the browser bundle. Derivatives are committed, so ordinary builds require no image processing.

The `<picture>` element selects one responsive WebP with JPEG fallback; `sizes`, width/height and high fetch priority are explicit. No speculative image preload competes with picture selection. Browser tests verify only one portrait is fetched and mobile devices choose appropriate variants. The small JPEG remains a fallback, not a second eager download.

`brand-assets.mjs` uses local Chrome canvas, the existing photograph and the actual local Manrope font to export a 1200×630 social PNG, 180×180 Apple touch icon and 64×64 favicon. It needs the same local browser permission as QA. The social image is fetched by link-preview crawlers, not the initial page. No transparent cutout is required; any future cutout must remain a separate derivative and preserve the source and fallback photograph.

## SEO and static deployment

Copy `.env.example` to `.env.local` and set **`VITE_SITE_URL` to your real HTTPS origin** when known. It must have no path, credentials, query or fragment. Never use an invented domain. `VITE_SITE_URL` may instead be set in the build environment. Rebuild after changing it.

The build injects the page title, description, Open Graph and Twitter text, and Person JSON-LD. With a configured origin it also adds canonical/OG URLs, absolute Open Graph/Twitter image URLs, image dimensions and alternative text, `sitemap.xml`, and the sitemap reference in `robots.txt`. Without an origin these absolute URLs and the sitemap are intentionally omitted. The default `robots.txt` allows crawling without claiming a deployment address. The sitemap needs only the root page; section anchors are not separate pages.

Serve `dist/` at the origin root on any static host. Preserve asset paths. Configure HTTPS and compression on the host, cache hashed assets immutably, and let HTML revalidate. No worker, database, API key, runtime environment or SPA fallback server is needed. Hosting credentials and a production destination have not been supplied; this repository remains ready for static deployment.

## Verification scope and performance

The browser suite covers the requested 320, 390, 430, 768, 1024, 1280, 1440 and 1920px widths, short/tall screens, and existing breakpoint boundaries. It checks overflow, image loading/selection, initial layout shifts, every anchor, main/heading semantics, navigation feedback, mobile menu/Escape/focus restoration, all disclosures with Enter and Space, contact destinations, five hero progress points (0%, 25%, 50%, 75%, 100%) and the beginning of About, pointer bounds/reset, tab-visibility pause, reduced motion, no observers, no JavaScript, console/runtime/network failures, and 200% zoom-equivalent reflow. Actual Chrome zoom at 200% was also manually inspected during this upgrade and reset afterward.

CI uses Node 24 and the Ubuntu runner's installed Chrome, with no extra browser install or third-party service. Failures produce a nonzero exit and JSON/screenshot artifacts. These are targeted Chrome and semantic checks, not a claim of comprehensive assistive-technology or cross-browser certification. The workflow is committed; its hosted GitHub run occurs on push.

See [PERFORMANCE.md](PERFORMANCE.md) for baseline/after measurements, dependency audit, initial payload estimates, largest assets, methodology and deliberate tradeoffs. The JavaScript test enforces a 76,000-byte gzip ceiling using Node zlib. Run `npm run size` to regenerate `.qa/production-sizes.json` after further changes.

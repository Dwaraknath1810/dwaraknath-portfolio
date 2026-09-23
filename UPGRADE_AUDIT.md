# Upgrade audit

## Baseline — 23 September 2026

Read the complete README, all tracked application/configuration/script files, dependency lockfile inventory, and existing browser QA. No AGENTS.md was found. Working tree was clean. The origin remote is `https://github.com/Dwaraknath1810/dwaraknath-portfolio.git`; the old README incorrectly said no remote existed. No hosting configuration or Vercel project was present.

The initial installed dependency tree was incomplete: Framer Motion and both Tailwind packages were missing. Initial ESLint passed; initial build failed on those imports. `npm ci --cache .npm-cache` restored the committed dependency tree. Lint and production build then passed; Vite build time was 288 ms (bundler only). Existing Chrome QA passed all eight widths: 320, 390, 430, 768, 1024, 1280, 1440, 1920. Standard motion and keyboard checks passed. All eight baseline hero screenshots were visually reviewed. Baseline output and screenshots are retained locally under `.qa/baseline/`.

| Baseline asset | Bytes |
| --- | ---: |
| Main JS | 293,731 |
| CSS | 37,751 |
| Manrope Latin variable WOFF2 | 24,836 |
| Small JPEG (576w) | 59,202 |
| Large JPEG (1122w) | 213,610 |
| HTML | 1,530 |
| Favicon | 208 |
| Initial mobile payload (small JPEG) | 417,258 |
| Initial desktop payload (large JPEG) | 571,666 |

Raw resource bytes, excluding protocol overhead; only the selected portrait is included. Gzip comparison and final measurements are in PERFORMANCE.md.

## Findings and decisions

- The root PNG and src/assets PNG were byte-identical: SHA-256 `e8704e0898695d2ce09d5ce9e555f7a5e7628e5b6f10aec8672fc22afa00f696`. The untouched root original remains. Only its duplicate was removed. The older nonidentical JPEGs are retained as legacy source assets and are not shipped.
- Projects were conceptual, with no linked repositories, demos, completed outcomes or metrics. Preserve status; add clearly proposed engineering detail and optional factual fields.
- Experience lacked dates, locations and verified outcomes. Preserve supplied companies and engineering topics; do not infer missing facts or current employment.
- Capabilities lacked a section ID. Add `capabilities`, linked from the footer, while retaining six primary navigation items.
- Contacts inferred behavior from display labels. Replace with explicit typed destinations, kind, external behavior and accessible labels.
- The old HTML offered only a JavaScript-enable message. Replace with full build-time React prerender and client hydration.
- The old hero depended on Framer Motion. Replace with a demand-rendered decorative Three/Fiber scene and an imperative scroll controller. Essential content and portrait remain DOM elements.
- Small utility usage did not justify Tailwind. Remove it and Framer Motion; preserve the CSS artwork and editorial system.
- Small body copy and touch targets were strengthened; keyboard focus forces staged content visible. Native disclosures, skip link, mobile Escape/focus restoration and active navigation are retained.
- Social preview, canonical support, schema, robots/sitemap, CI, formal unit tests and hosting configuration were absent.

## Dependency responsibilities

React/React DOM: rendering, hydration and build-time HTML. Manrope: one local Latin WOFF2. Lucide: tree-shaken semantic interface icons. Three + Fiber: the real hero geometry, lighting and demand rendering. No Drei, physics, postprocessing or additional animation engine. Sharp is development-only asset tooling. TypeScript, Vite, React plugin and ESLint remain build/check tools. Fiber 9.8.0 peer requirements and Three 0.186.0 were checked against React 19.2.8 before installation; the installed production build is typechecked and browser-tested.

See README.md for architecture and commands, CONTENT_NEEDED.md for factual gaps, and PERFORMANCE.md for measured costs and limits.

## Final local verification and deployment status

- `npm ci` succeeds using the final lockfile.
- `npm run check` passes strict TypeScript, ESLint, production build/prerender, seven Node tests and the JavaScript gzip budget.
- Chrome QA passes 366 layout/interaction checks across 18 viewport combinations and 49 additional motion/fallback/keyboard checks. All eleven disclosures are opened and closed with native keyboard events. No console errors, runtime exceptions or failed network requests were recorded.
- Full-page and hero screenshots were visually reviewed across the viewport matrix, together with five scroll stages, About transition, reduced motion, WebGL/context-loss fallbacks, mobile, no-JavaScript, zoom reflow, case-study content and the social image. Review found and corrected a mobile title stacking issue, small-phone portrait-caption overlap and no-JavaScript style precedence.
- The core text palette passes WCAG AA contrast-ratio tests. The 200% check uses equivalent CSS viewport/device scale, not OS-level browser UI automation. Hidden-tab behavior is checked by simulating the document visibility signal. No physical-device or screen-reader certification is claimed.
- GitHub contact destination returned HTTPS 200. Email destination syntax/display are tested; no email was sent and mailbox ownership/delivery is not inferred.
- `git diff --check` passes. No unrelated edits existed at the start, no unsupported professional dates/metrics/outcomes were added, and the original portrait hash still matches. No unfinished TODOs, debug logging or placeholder links remain in application code. Diagnostic reports/scripts write only within ignored `.qa` or the documented build outputs.
- GitHub Actions is configured; it has not run remotely because no commit/push was requested or performed.

**Deployment is blocked at authentication.** Vercel CLI 59.25.4 reported `Logged out` from `vercel whoami`. No preview, production deployment, production origin, custom domain or paid plan was created. `vercel.json` and `.vercelignore` are ready. The single required owner action is:

```sh
npx vercel login
```

After login, resume with a preview deployment, test its actual returned URL, obtain the project's real production alias, set VITE_SITE_URL for Production, deploy production, and run the production smoke test. No local implementation needs to be repeated. Canonical/absolute image metadata and sitemap intentionally remain absent in the current local output until a real origin is available.

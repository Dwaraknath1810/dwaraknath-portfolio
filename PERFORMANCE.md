# Performance and verification report

Measured locally on 17 September 2026, macOS ARM64, Node 25.8.0, Vite 8.2.2. Decimal KB means 1,000 bytes. The working tree was clean before editing; no unrelated changes were present or overwritten.

## Baseline and final output

The original lint, production build, and Chrome suite all passed before implementation. Baseline screenshots and reports were retained under `.qa/baseline/`. The original breakpoints (599/600, 640/641 and 1023/1024px, plus decorative artwork containers) were inspected; the final suite also exercises their neighboring widths.

| Measurement | Original | Final |
| --- | ---: | ---: |
| JavaScript, uncompressed | 293.73 KB | 226.43 KB |
| JavaScript, Vite reported gzip | 93.76 KB | 70.12 KB |
| CSS, uncompressed | 37.75 KB | 37.83 KB |
| CSS, Vite reported gzip | 9.48 KB | 9.04 KB |
| Manrope variable WOFF2 | 24.84 KB | 24.84 KB |
| Generated HTML | 1.53 KB (SPA shell) | 29.30 KB (complete content) |
| JPEG, small | 59.20 KB / 576px | 26.87 KB / 576px |
| JPEG, large | 213.61 KB / 1122px | 76.62 KB / 1122px |
| WebP, phone | — | 14.97 KB / 480px |
| WebP, tablet/desktop | — | 29.84 KB / 768px |
| WebP, high density | — | 51.86 KB / 1122px |
| Original portrait PNG | 1,778.21 KB × 2 copies | 1,778.21 KB × 1 preserved source |

The complete upgraded site uses **25.2% less gzipped JavaScript** by the same Vite reporting method. Small/large JPEG fallbacks are 54.6%/64.1% smaller. Comparing the original small JPEG to the new phone WebP saves 74.7%; original large JPEG to large WebP saves 75.7%. Phone resolution is intentionally lower while the original high-resolution source remains recoverable.

### Isolated dependency removals

Measured intermediate builds, before adding the new hero and content features:

| Stage | JS raw / Vite gzip | CSS raw / Vite gzip | Vite client build |
| --- | --- | --- | --- |
| Original | 293.73 / 93.76 KB | 37.75 / 9.48 KB | 267 ms |
| Tailwind removed | 293.68 / 93.73 KB | 32.39 / 7.91 KB | 201 ms |
| Framer Motion also removed | 218.06 / 67.78 KB | 32.39 / 7.91 KB | 80 ms |
| Final representative build | 226.43 / 70.12 KB | 37.83 / 9.04 KB | 175–192 ms + ~8 ms prerender bundle |

Tailwind removal eliminated 12 installed packages and about **1.57 KB compressed CSS**. Framer removal eliminated four packages and about **25.95 KB compressed JavaScript**. The new motion controller, richer optional content renderer, and progressive enhancements add approximately 2.34 KB compressed JavaScript over the library-free intermediate build. Build timings are individual warm local observations, not controlled benchmark claims; they exclude TypeScript and full command startup. The final architecture also adds intentional build-time prerendering.

### Cold initial payload

`npm run size` uses Node zlib default gzip and reports exact bytes in `.qa/production-sizes.json`. Vite's compressed-size estimates differ slightly, so the estimates below use **one consistent Node gzip method** for JS, CSS and HTML; WOFF2 and images are counted as their actual already-compressed file sizes. No Brotli savings or host-specific caching is assumed.

| Initial load | Before, estimated | After, estimated | After, uncompressed transfer without host compression |
| --- | ---: | ---: | ---: |
| Small phone, DPR 1 | ~186.98 KB | 125.61 KB | 334.83 KB |
| Desktop, DPR 1 | ~341.39 KB | 140.48 KB | 349.70 KB |
| Desktop, DPR 2 | ~341.39 KB | 162.50 KB | 371.72 KB |

These include HTML, JS, CSS, one font, **one selected portrait**, and favicon, excluding HTTP headers. Baseline HTML gzip is rounded from the original build log; the original JS/CSS were recompressed from preserved baseline files with the same Node gzip method (92,695 / 9,418 bytes). Final exact gzip JS/CSS are 69,355 / 8,988 bytes and HTML is 5,999 bytes. Phone DPR 2 selects the 768px image and has approximately the desktop-DPR-1 payload. Responsive-image tests verify selection at both DPRs and no JPEG double download.

There are no asynchronously loaded JavaScript chunks, remote fonts, trackers, or third-party page requests. All concept artwork is CSS. Future case-study media uses native lazy loading. The social card and Apple icon are not part of the ordinary initial page payload; crawlers and supported devices request them separately.

### Largest production files

| Asset | Raw size | Loading behavior |
| --- | ---: | --- |
| `social-preview.png` | 405.29 KB | Only social-preview consumers; never rendered in page |
| Main JavaScript | 226.43 KB | Initial, ~70 KB compressed |
| Large JPEG fallback | 76.62 KB | Only when selected and WebP unsupported |
| Large WebP portrait | 51.86 KB | High-density screens |
| Main CSS | 37.83 KB | Initial |
| Medium WebP portrait | 29.84 KB | Tablet/desktop or high-density phone |
| Prerendered HTML | 29.30 KB | Initial, ~6.00 KB Node gzip |
| Small JPEG fallback | 26.87 KB | Small legacy-image fallback |
| Manrope font | 24.84 KB | Initial, self-hosted and preloaded |
| Small WebP portrait | 14.97 KB | Small phone |

## Asset audit

The only original image files were the root portrait PNG, its identical `src/assets/` copy, two delivery JPEGs, and the favicon. No other unused or duplicate production imagery was found. Both source copies initially had SHA-1 `8f1f22cb37792ea48fd55f12027f3053fc0dc506`; the retained root source has exactly the same hash after implementation. The copy was removed only after byte equality was verified. No transparent cutout, replacement face, generated portrait, or third-party character was used.

WebP/JPEG derivatives are produced by `scripts/optimize-images.mjs` from the original. The deterministic brand-asset script uses the delivered real photo and local font. All existing conceptual CSS artwork remains, with its small decorative labels hidden from assistive technology.

## Dependency audit

Every original direct dependency was reviewed:

| Dependency | Decision / purpose |
| --- | --- |
| `react`, `react-dom` | Retained for components, hydration, and build-only rendering |
| `@fontsource-variable/manrope` | Retained; exactly one Latin variable WOFF2 is shipped |
| `lucide-react` | Retained; named imports supply existing accessible decorative icons |
| `framer-motion` | Removed; replaced with CSS, IntersectionObserver, and a small controller |
| `tailwindcss`, `@tailwindcss/vite` | Removed; the handful of layout utilities became ordinary CSS |
| `vite`, `@vitejs/plugin-react` | Retained for the existing build/dev architecture and temporary build renderer |
| `typescript`, `@types/node`, `@types/react`, `@types/react-dom` | Retained for strict checking and supported APIs |
| `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals` | Retained; each is used by the lint configuration |
| `sharp` | Added only as a development tool for reproducible image optimization; zero browser bytes |

No animation, 3D, browser-automation, or runtime server library was added. Chrome QA reuses the original CDP implementation, split into shared helpers and focused scenarios. Node's built-in test runner handles non-browser tests.

## Verification and deliberate tradeoffs

- TypeScript, ESLint, build/prerender, and all 10 non-browser tests pass.
- Chrome suite covers 18 viewport configurations and 573 checks across base, keyboard and extended scenarios. It exercises all eight requested widths, short/tall viewports, original breakpoints, all disclosures, hero progress, About transition, active/mobile navigation, Escape/focus, internal/external destinations, image selection, reduced motion and static fallback.
- No browser console errors, runtime exceptions, HTTP errors, or unexpected network failures were found in the completed runs.
- Actual Chrome UI zoom was set to 200%; the 855×448 CSS viewport had scroll width 855px, all eight sections, static hero behavior and a working skip link. Zoom was restored to 100%. Automated CI additionally tests a 720×500 CSS viewport / DPR 2 zoom-equivalent reflow case.
- The supplied GitHub destination was opened successfully in Chrome. Email destination and display agree; no test email was sent.
- A test-only `.test` origin verified canonical, social URLs, sitemap, and robots generation end to end. It was removed by rebuilding without a domain; it is never a shipped production URL.
- Initial layout shifts are captured with PerformanceObserver and constrained below 0.1. A font preload reduces the font swap window while keeping `font-display: swap` and immediate readable fallback text. Results are local lab checks, not field Core Web Vitals.
- The hero preserves the rectangular portrait without a cutout. On desktop, AI and ENGINEER enter through substantial upward masks at 10–35% progress, introduction at 35–60%, and actions/support at 50–75%. The final quarter settles into About through normal scrolling. All six requested screenshot stages were visually inspected. Mobile, short screens, reduced motion, and absent observer support use a complete static cover; keyboard focus also reveals the full composition. The desktop sequence deliberately delays visual text in response to the corrected brief while keeping static HTML and assistive-technology content complete.
- CSS remains close to its original raw size because larger readable labels, richer case-study states, hero layering, and explicit reset/fallback styles replace the removed utilities.
- Social metadata is complete structurally but domain-dependent fields are deliberately withheld until the owner configures a real origin. The site remains purely static and was not deployed to an invented destination.
- GitHub Actions is configured, but a hosted run requires pushing the repository. Chrome verification is not a substitute for a full assistive-technology or multi-browser certification.

The full local records are `.qa/browser-results.json`, `.qa/production-sizes.json`, `.qa/manual-checks.json`, `.qa/configured-seo-test.json`, and screenshots. `.qa/` is intentionally ignored rather than committing browser profiles or generated image captures.

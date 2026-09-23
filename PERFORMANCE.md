# Performance measurements

Measured locally on 23 September 2026, macOS ARM64, Node 25.8.0, Vite 8.2.2. CI targets Node 24 LTS. Measurements compare the restored original locked build with the final production build, not development-server assets.

## Methodology

`npm run size` enumerates actual `dist` files and computes Node `gzipSync` at its default level. Values below are decimal kB (1,000 bytes), with exact bytes in `.qa/sizes.json`. Vite's displayed gzip figures use a different compression setting and are slightly larger; do not mix the two. Fonts/images are already compressed, so estimated transfer totals use their original byte sizes and gzip only HTML/JS/CSS. HTTP/TLS/header overhead, cache hits, connection latency and provider-specific Brotli are excluded. These are resource-byte measurements, not Lighthouse scores or field Core Web Vitals.

Baseline build and QA artifacts remain locally in `.qa/baseline/`. The baseline had no 3D or prerender. It downloaded a 576w or 1122w JPEG depending on device. The final `picture` selects one 480/800/1122 WebP, with a corresponding JPEG fallback. Browser QA tests a cold mobile document because Chrome can keep a larger already-cached srcset candidate after a viewport resize.

## Before and after

| Resource | Before raw | After raw | Before gzip | After gzip |
| --- | ---: | ---: | ---: | ---: |
| Main JavaScript | 293.731 kB | 228.740 kB | 92.695 kB | 70.351 kB |
| Optional Three/Fiber chunk | 0 | 915.038 kB | 0 | 240.195 kB |
| CSS | 37.751 kB | 35.392 kB | 9.418 kB | 8.552 kB |
| HTML | 1.530 kB | 31.133 kB | 0.621 kB | 6.565 kB |
| Manrope Latin variable WOFF2 | 24.836 kB | 24.836 kB | — | — |
| Small portrait | 59.202 kB JPEG / 576w | 13.612 kB WebP / 480w | — | — |
| Large portrait | 213.610 kB JPEG / 1122w | 46.386 kB WebP / 1122w | — | — |
| WebGL textures | 0 | 0 | — | — |

Main JS is 22.1% smaller raw (24.1% smaller gzip). Full HTML grows because it now contains the actual portfolio instead of an empty React mount. The 1122w WebP is 78.3% smaller than the previous 1122w JPEG. The small-image comparison changes both resolution and codec; it is not a same-resolution benchmark.

## Initial and deferred payload

Includes HTML, main JS, CSS, one font, one selected portrait and favicon; excludes social preview, unused picture candidates and optional Apple icon.

| Scenario | Raw resource bytes | Estimated compressed transfer |
| --- | ---: | ---: |
| Original small JPEG | 417,258 | 186,980 |
| Original large JPEG | 571,666 | 341,388 |
| Final 480w WebP | 334,466 | 124,669 |
| Final 800w WebP | 349,708 | 139,911 |
| Final 1122w WebP | 367,240 | 157,443 |
| Additional deferred 3D, eligible devices only | 915,038 | 240,195 |

The cold 390px DPR-1 browser test requests exactly one 480w WebP. DPR-2 phones may correctly choose 800w. Desktop selection depends on DPR and the 480px maximum portrait display width. Phones below 768px and reduced-motion visitors never import the 3D chunk. Eligible desktops do incur its cost: a 1122w initial load plus 3D is approximately **397.638 kB** compressed, greater than the original large-image page. This is the explicit tradeoff for real WebGL rather than an animation-library-only hero.

The 3D import starts after a 1.2-second deferral and after portrait decoding, so it does not gate the photograph. The CSS canvas layer is absolutely positioned in preallocated hero space. No second portrait texture/download exists. The Three/Fiber chunk remains the largest production asset and triggers Vite's normal 500 kB warning. That warning is intentionally not suppressed. Total JS gzip is approximately 310.5 kB, below the enforced 400 kB budget.

## Asset inventory and reproduction

| Portrait width | WebP bytes | JPEG fallback bytes |
| --- | ---: | ---: |
| 480 | 13,612 | 21,497 |
| 800 | 28,854 | 47,193 |
| 1122 | 46,386 | 80,949 |

The untouched 1,778,210-byte root PNG is retained, hash-verified by tests, and absent from `dist`. Its byte-identical source copy was removed. Legacy nonidentical JPEGs are retained but unimported. `npm run assets` regenerates derivatives directly from the original (Sharp resize, WebP quality 80/effort 6, mozjpeg quality 82). No facial retouching. `node scripts/social-preview.mjs` renders real portrait + embedded Manrope in local Chrome and encodes the 1200×630 JPEG (46,265 bytes); it is not an initial-page request. The scene uses procedural geometry and zero texture assets.

## Runtime and verification

The scene uses one decorative canvas, demand rendering and DPR capped at 1.35. There are three thin torus meshes, nine small nodes, one line geometry and two translucent planes. Geometry/materials are declared once and disposed by Fiber. Scroll values update refs/CSS variables; Three transforms mutate existing objects without allocating vectors/materials/geometries per frame. Pointer interpolation schedules only the finite settling frames. No shadows, postprocessing, physics or permanent animation timer.

Browser QA verifies stable frame counts after settling and outside the hero, a simulated document-hidden signal, correct stage progress, portrait-first loading, context-loss fallback and forced unsupported WebGL. The complete static mobile and reduced-motion composition avoids rendering work entirely on phones/reduced motion. Real GPU energy usage and physical Safari/mobile behavior were not benchmarked; headless Chrome uses software WebGL for repeatable functionality checks.

Baseline Vite bundling took 288 ms; final measured Vite bundling took 264 ms. These are single warm local samples excluding TypeScript and prerender, not a statistically meaningful speed claim. The new build also performs static prerendering. `npm ci` was repeated successfully against the final lockfile.

Removed: Framer Motion, Tailwind CSS and Tailwind's Vite plugin. Added runtime: Three 0.186.0 and Fiber 9.8.0. Added development-only: Three type declarations and Sharp. React, React DOM, Lucide, Manrope, strict TypeScript, Vite and ESLint remain. No Drei or heavy test runner was added.

Production-network measurements remain pending Vercel authentication; local results must not be presented as deployed field results.

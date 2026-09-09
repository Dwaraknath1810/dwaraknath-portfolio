# Dwaraknath Balaji — AI Engineer

An editorial portfolio built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Lucide React. All content and assets are local. No account, API key, backend, or production domain is required.

## Local development

```sh
npm install
npm run dev
```

Open the URL Vite prints. To validate and preview production output:

```sh
npm run lint
npm run build
npm run preview
```

Use the committed `package-lock.json` with `npm ci` for reproducible installations. The project was built on macOS ARM64 using Node 25.8.0, npm 11.11.0, and Git 2.51.2. Vite 8 requires a compatible modern Node version; see its [official guide](https://vite.dev/guide/).

## Personalize the content

Edit `src/data/portfolio.ts` for identity, navigation, expertise, projects, experience, technical capabilities, philosophy, and contact details.

The two contact methods are centralized in `contactLinks`:

- Email: `dwaraknath.balaji@gmail.com`.
- GitHub: `https://github.com/Dwaraknath1810`.

The email address is displayed in full and opens a `mailto:` link. The GitHub profile is displayed without the URL scheme and opens in a new tab with `noopener noreferrer`. Updating either value in the data file updates its display and destination together.

The three work entries are explicitly labeled **Project direction**, with conceptual illustrations and expandable approaches. Replace these with substantiated case studies when actual project material is available. No dates, metrics, client claims, or repository URLs were inferred.

The copyright year is calculated automatically. Edit SEO and social preview text in `index.html`. Add a canonical URL and absolute social image URL only after choosing an actual production domain.

## Architecture

```text
.
├── .gitignore
├── README.md
├── dwaraknath-portrait.png          # untouched source supplied by the owner
├── eslint.config.js
├── index.html                      # title, SEO, social metadata, no-JS message
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── favicon.png
├── scripts/
│   └── browser-check.mjs           # optional macOS Chrome verification
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── assets/
    │   ├── dwaraknath-portrait.png  # byte-identical source copy
    │   ├── dwaraknath-portrait.jpg
    │   └── dwaraknath-portrait-small.jpg
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   └── Footer.tsx
    │   └── ui/
    │       ├── ProjectArtwork.tsx
    │       ├── Reveal.tsx
    │       └── SectionLabel.tsx
    ├── data/
    │   └── portfolio.ts
    ├── sections/
    │   ├── Hero.tsx
    │   ├── About.tsx
    │   ├── Expertise.tsx
    │   ├── Projects.tsx
    │   ├── Experience.tsx
    │   ├── Capabilities.tsx
    │   ├── Philosophy.tsx
    │   └── Contact.tsx
    └── styles/
        ├── global.css
        ├── header.css
        └── artwork.css
```

Generated `node_modules/`, `dist/`, `.npm-cache/`, and `.qa/` are ignored by Git. The Vite template's demonstration components, illustrations, and styles were removed.

## Design and behavior

- Charcoal `#101112`, off-white `#eeefec`, secondary gray `#969b9f`, fine borders `#303336`, metallic blue `#abc2d4`.
- One self-hosted Manrope variable font, limited to the Latin WOFF2 file. No remote font requests.
- CSS tokens cover surfaces, colors, spacing, content width, gutters, and responsive type. Tailwind's Vite integration supplies utility styles.
- Hero uses responsive JPEG sources, explicit dimensions, a high-priority fetch, CSS monochrome treatment, and responsive object positioning. Masked headline lines overlap a wider portrait frame; mobile uses its own title placement and crop. Neither original PNG is rewritten.
- Expertise is a numbered native disclosure index. Projects use large chapter numbers, varied desktop proportions, and native expandable approaches. Their CSS illustrations depict semantic retrieval, structured tool execution, and source-to-response evidence.
- Experience omits unprovided dates. Capabilities use four typographic groups. A silver-blue philosophy section presents the four-step engineering loop.
- Below 1024px navigation becomes a keyboard-accessible disclosure. Below 641px the hero is recomposed, projects stack, and content spacing changes. Tablet capabilities use two columns.
- Navigation follows the current section with `aria-current` and a discreet underline. The header gains definition after scrolling; the mobile menu closes on Escape, selection, or keyboard focus leaving the header.
- Framer Motion handles one-time headline masks, image reveals, section entrances, and a hero rule reveal through `LazyMotion`. Hover movement stays subtle; no continuous animation, springs, GSAP, or animation timers.

## Accessibility and verification

Semantic landmarks, one H1, ordered section headings, skip link, visible keyboard focus, meaningful portrait alt text, decorative artwork hidden from assistive technology, native disclosures, mobile navigation state announcements, and Escape dismissal with focus return are included. Reduced motion disables CSS animation and smooth scrolling, and prevents entrance transforms in Framer Motion.

The optional browser check uses the existing macOS Google Chrome installation and Node's built-in WebSocket support; it does not download browser software or add dependencies. Start `npm run dev` in another terminal, then:

```sh
node scripts/browser-check.mjs
```

Set `PORTFOLIO_URL` to the URL printed by a different local server when needed. Browser output and screenshots are saved in `.qa/`. The check covers 320, 390, 430, 768, 1024, 1280, 1440, and 1920px widths, overflow, images, active navigation, contact destinations, disclosures, reduced motion, and runtime errors. Normal-motion entrances and keyboard activation are also checked from a fresh page load. This is targeted verification, not a comprehensive assistive-technology audit.

## Scope

This is a local static portfolio. Contact methods use the owner's supplied email and GitHub profile. Project artwork is conceptual, and the page includes no contact form or fabricated case-study destinations. Social metadata has no invented production URL or image. No GitHub repository, remote, credentials, or hosting is configured.

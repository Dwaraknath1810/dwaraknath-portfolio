# Content needed from Dwaraknath

The site is technically complete without these facts. Optional fields are omitted rather than replaced with invented values. The original descriptions and project-direction status are preserved.

## Employment

For Phoenix ICT Solutions and Zscaler, provide:

- Verified start/end dates (ISO `YYYY-MM` or `YYYY-MM-DD`), role-specific dates if relevant, and location.
- Confirmation that the existing current/previous designation remains accurate. The implementation maps the original Phoenix `previous: false` to `current: true`.
- Scope of ownership, responsibilities, team/product context, engineering decisions, and a concise role summary.
- Verified outcomes or highlights, with measurement method and time period for any metric.
- Optional official company URLs, and any further technologies actually used.

The existing Zscaler focus areas were regrouped into readable contributions. No promotion dates, leadership claims, ownership level, or business impact were inferred. Confirm the sequence of the listed QA internship and Associate SDE role before adding a dated timeline.

## Projects

All three entries remain **Project direction**. For each proposed case study, provide:

- Actual status and project type; objective, context, your role, and responsibilities.
- Architecture, implementation approach, engineering decisions and alternatives considered.
- Constraints, challenges, evaluation methodology, verified outcomes and metrics.
- Technologies actually used, screenshots/diagrams you have permission to publish, descriptive alternative text, and image dimensions.
- Real repository, demo, and detailed case-study URLs, where available.
- Evidence of completion/deployment before changing status or claiming production use.

Do not add placeholder URLs, speculative user counts, invented client names, or unverified results. The existing proposed approaches are explicitly presented as proposals.

## Identity and contact

- Optional résumé PDF, confirmed public and current, before adding a download link.
- Any additional professional profiles and approved public destinations.
- Any desired changes to the existing positioning statement, location, or public business email.

The supplied email and GitHub destination are retained. No message was sent to test the email.

## Production configuration

- Real HTTPS production origin for `VITE_SITE_URL`. No domain was invented.
- Hosting destination. Publish the generated `dist/` directory as static files at the origin root.
- Review `public/social-preview.png`: a finished 1200×630 preview using the supplied real portrait, Manrope, and the site palette is included. Supply any preferred approved replacement at the same dimensions, and update its accessible description in `src/data/site.ts` if the image changes.

Without a production origin the build intentionally omits canonical, `og:url`, absolute social image URLs, and `sitemap.xml`; `robots.txt`, page metadata, Person JSON-LD, icons, and fully prerendered content are still generated. Setting the origin and rebuilding emits all domain-dependent metadata and the sitemap.

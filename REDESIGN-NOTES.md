# Local Redesign Review

The preview runs at http://localhost:4321/.

Start command: node scripts/serve.mjs
Equivalent npm command: npm run dev

Implementation and QA were completed locally without commits, pushes, releases,
public uploads, or deployments, before the user's approval to push to GitHub.
The baseline before approved publication was
633720008b0601304e2a39ee4823d3381dc89c2f.
Canonical URLs, robots.txt, sitemap.xml, and remote configuration are unchanged.

## Architecture

The existing static HTML, CSS, and JavaScript architecture is retained.
Project data remains in assets/js/data.js. All nine projects, both client
testimonials, project live links, printable resume, pricing, and the Gmail
draft-based enquiry workflow are retained.

The old design used several overlapping style layers and two reveal systems.
The new design separates global styling, homepage styling, case-study styling,
and a single motion system. Shared markup helpers render project previews and
case-study content without a browser framework or runtime package dependency.

## Design and Interaction

- Graphite surfaces, warm white typography, restrained green accent.
- Editorial hero with a short session-based intro and workflow-line backdrop.
- Four large selected-work showcases and all nine projects on the work page.
- Desktop expertise selector and mobile accordion, usable with a keyboard.
- Six-stage workflow tabs with arrow-key, Home, and End navigation.
- Sticky navigation, mobile focus containment, Escape handling, and focus return.
- Desktop-only cursor states with native pointer behavior retained.
- Scroll reveals, reduced-motion support, and progressive page transitions.
- Full-size case-study screenshots, overview, challenge, solution, features,
  technical implementation, outcome, and next-project navigation.
- Portrait, compact toolkit, both testimonials, and clear final contact actions.
- Portrait displays in black and white; testimonial project links share the
  same desktop alignment.
- Four intro specialties rotate one at a time on the same line, with roughly
  900 ms per specialty and a four-second intro. Append ?intro=1 to the local
  URL to replay it.
- The Beyond Websites link opens the broader Systems page.
- A matching JR monogram favicon is used throughout the portfolio, including
  SVG, 16/32-pixel PNG, and 180-pixel touch-icon variants.

Project years are omitted because the existing project records do not provide
them. Laravel, React, and TypeScript remain identified as technologies being
explored. No numerical client performance claims were added.

## File Inventory

Modified:

- index.html
- about/index.html, contact/index.html, pricing/index.html
- resume/index.html, services/index.html, systems/index.html
- work/index.html and all nine work/*/index.html wrappers
- assets/css/site.css, assets/css/motion.css, assets/css/case-systems.css
- assets/js/site.js, assets/js/motion.js, assets/js/case.js, assets/js/data.js

Created:

- assets/css/home.css
- assets/js/home.js, assets/js/ui.js
- assets/icons/arrow-up-right.svg, arrow-right.svg, arrow-down.svg, plus.svg,
  x.svg, and LICENSE.txt
- img/acerbox-builds-preview.webp, esperanza-preview.webp,
  fcj-printing-preview.webp, journey-home-preview.webp,
  margarita-preview.webp, rlr-car-rental-preview.webp
- package.json, .gitignore, LOCAL-PREVIEW.md, REDESIGN-NOTES.md
- scripts/project.mjs, scripts/serve.mjs, scripts/check.mjs, scripts/build.mjs
- tests/site.test.mjs
- img/favicon/jr-mark.svg, jr-mark-16.png, jr-mark-32.png, jr-mark-180.png

Follow-up refinements also update resume.html favicon references.

Removed:

- assets/css/tech-ui.css: obsolete decorative styles, no remaining references.
- assets/js/work-systems.js: obsolete screenshot-placeholder handling, replaced
  by shared project rendering with actual screenshots.

Original image assets and the printable resume are retained.

## Validation

- npm run lint: JavaScript syntax checks and project slug validation.
- npm test: four passing content, routing, public-file, and enquiry tests.
- npm run build: local static copy into the ignored dist/ directory.
- Browser review of all 17 pages at 320, 375, 390, 430, 768, 1024, 1280,
  1440, and 1920 pixels: no horizontal overflow; one H1 per page.
- Checked 33 local page and image links: all returned HTTP 200.
- Axe WCAG A/AA checks passed on desktop/mobile homepage, contact, pricing,
  ServiceFlow, and Davis Pest Solutions pages.
- Verified intro timing/session skip, custom cursor, touch behavior,
  reduced motion, expertise interaction, workflow keyboard controls, mobile
  navigation, project filters, and actual image rendering.
- Gmail draft navigation verified with a locally intercepted request.
  No message was sent.
- Verified root preview and /Portfolio/ subdirectory asset/link behavior.
- No browser console errors or failed resource requests.
- Lighthouse mobile audit on localhost: Performance 99, Accessibility 100,
  Best Practices 100, SEO 100. LCP 1.6 seconds, CLS 0, TBT 70 ms.
  Local audit scores are measurements of this preview, not production promises.
- Six optimized WebP previews total 574,102 bytes versus 4,229,673 bytes for
  their originals, approximately 86% smaller.

Review screenshots and the Lighthouse JSON report are stored locally in the
ignored .preview/ directory. Temporary QA dependencies live outside the project.
No dependencies are required to run the preview, build, lint, or Node tests.

## Review Before Publishing

Review the homepage, project presentation, portrait, and contact flow locally.
Confirm project years before adding them to case-study metadata.
Publishing requires the explicit instruction: "Push it to GitHub".

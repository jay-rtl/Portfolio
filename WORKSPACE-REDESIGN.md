# Francis / Workspace — local redesign completion report

## Result and review

Local preview: **http://localhost:4321/**

A dark application-style portfolio with a persistent desktop sidebar, compact top bar, reusable glass panels and eight individually addressable workspaces. The mobile experience has a compact header, direct Resume access, five-item bottom navigation, horizontally browsable projects and touch interactions.

**Local only. No commit, push, deployment, production write or hosting change was performed.**

## Architecture

The existing static multipage architecture is retained. There is no React/framework migration and no runtime package dependency. Native JavaScript handles behavior; reusable renderers produce both static HTML and browser updates. The overview, project explorer, systems, services, tech stack, profile, testimonials and contact views use hash navigation with browser back/forward support.

Existing case-study, About, Resume, Pricing, Services, Systems and Contact URLs remain available inside the shared application shell. Their canonical URLs and SEO metadata are retained. The standalone printable resume is unchanged.

The homepage and four main workspace pages are generated through `npm run generate`. This keeps content indexable and provides useful content without JavaScript. The original project data remains in `data.js`; workspace-specific content is in `workspace-data.js`. The generator and browser share `workspace-components.js`.

## Components and interactions

- App shell, sidebar, top bar, mobile navigation, location clock, status badges and direct Resume link.
- Dashboard: introduction, availability, exact project count, three disciplines, featured Acerbox Builds window, workflow diagram, current focus and client quote.
- Project explorer: all nine original projects; search, category filters, keyboard tabs, touch swipe, project preview, technologies, challenge, solution, outcome, live links and case studies.
- Systems workspace: interactive website-to-operation flow, illustrative architecture, two existing custom WordPress systems and capability modules. Earlier scope distinctions are retained in a disclosure panel.
- Six service modules preserving the original service lists, with accessible details and subtle pointer-hover explanation.
- Technology tabs; learning technologies remain explicitly marked Exploring.
- Profile, SuroyTabai founder role and a timeline based on the existing resume, without invented dates or accomplishments.
- Three original testimonials, preserved verbatim; previous/next, direct selection, keyboard arrows and touch swipe. No autoplay.
- Project request form with validation, service preselection and the existing Gmail draft behavior. No email is sent by the website. A disabled-submit/email fallback protects users without JavaScript.
- Command palette: Ctrl+K / Cmd+K, fuzzy search, arrow keys, Enter, Escape, focus containment and restoration. Includes pages, all case studies, Resume, pricing, email, GitHub and the supplied LinkedIn profile.

## Visual and motion system

Monochrome navy/charcoal surfaces, restrained indigo accents, low-opacity borders, translucent navigation and controlled shadows. Typography uses a system sans-serif stack and small monospace metadata, avoiding a font download.

CSS and the Web Animations API provide finite panel reveals, short preview changes, connection-line entrance, pointer illumination, very small button movement and project-window depth. First-visit introduction lasts about 820 ms, with a 1-second removal fallback; returning sessions and deep links skip it. Reduced motion disables transitions, animation and pointer depth. No animation library, oversized custom cursor or continuous animation loop is used.

## Files created

- `assets/css/workspace.css`
- `assets/js/workspace-data.js`
- `assets/js/workspace-components.js`
- `assets/js/workspace.js`
- `scripts/workspace-content.mjs`
- `scripts/browser-qa.mjs`
- `scripts/interaction-qa.mjs`
- `scripts/lighthouse-qa.mjs`
- `tests/fixtures/client-feedback.json`
- `package-lock.json`
- `WORKSPACE-REDESIGN.md`

## Files modified / replaced

- `index.html`, `work/index.html`, `systems/index.html`, `services/index.html`, `contact/index.html`: new static workspace content.
- `about/index.html`, `pricing/index.html`, `resume/index.html` and all nine `work/*/index.html` case studies: shared application shell/styles/scripts while retaining their content and metadata.
- `assets/js/site.js`: shared shell replaces old header/footer; original form handling retained.
- `assets/js/motion.js`, `assets/css/motion.css`: coherent, reduced-motion-aware animation system.
- `tests/site.test.mjs`: update the obsolete custom-cursor expectation for the intentionally replaced motion architecture.
- `package.json`: development-only browser/audit tools and generation commands; no production dependency.
- `LOCAL-PREVIEW.md`: current preview, content-generation and QA instructions.
- Removed obsolete `assets/css/home.css` and `assets/js/home.js`, which were fully replaced by workspace components and styles.

Unchanged: original project data, images, case-study content renderer, base content styles, printable resume, CNAME, sitemap, robots.txt, verification file, preview server/public-file restrictions and deployment settings.

## Verification

- Syntax checks, all 7 Node regression tests, static build and whitespace checks pass.
- All eight workspaces tested at 1920, 1440, 1024, 768, 430, 390 and 320px; no page overflow.
- All 17 public sitemap routes tested at desktop and mobile sizes.
- 27 collected local page/image links returned HTTP 200. All nine project images decoded successfully. All seven client websites and GitHub returned HTTP 200. LinkedIn returned HTTP 999 to the automated check; the supplied profile URL is retained, but its page availability was not independently verified.
- Project search and filtering, all project selections, tab keyboard navigation, workflow controls, technology tabs, service disclosures and carousel navigation verified.
- Ctrl+K, Cmd+K, fuzzy search, Enter navigation and Escape verified.
- Form required-field validation, service preselection, correct recipient and draft body verified through local Gmail interception. No message sent.
- Touch swipe handlers, mobile navigation, returning-session intro skip, reduced motion and no-JavaScript content/form fallback verified.
- Axe WCAG 2 A/AA and 2.1 AA checks: no violations across the eight workspaces and representative About, Resume, Contact, Pricing and system case-study templates at desktop/mobile sizes.
- No browser console errors or page exceptions in the completed browser suite.
- Both root and `/Portfolio/` base paths verified.
- Original testimonials compared against an independent fixture; original project data, printable resume and deployment-related files verified unchanged.

### Baseline Lighthouse before the visual refinement

| Audit | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 95 | 99 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| Largest contentful paint | 2.6 s | 0.6 s |
| Cumulative layout shift | 0 | 0.015 |
| Total blocking time | 10 ms | 0 ms |

These are local emulated audits, not production guarantees or physical-device measurements. Optimizations include existing WebP screenshots, fixed image dimensions, lazy-loaded project previews, system fonts, no third-party runtime resources, and no UI framework. The subsequent refinement adds a locally hosted GSAP runtime. Source remains readable; there is no additional minification pipeline.

Reports and screenshots are stored in `.preview/`. The browser tests are repeatable with development dependencies installed.

## Input / review remaining

No missing content blocks implementation. LinkedIn uses the exact profile supplied in this conversation; review that link in your normal browser because the automated check returned HTTP 999. Review the visual direction and interactions locally before authorizing any publication. The contact flow intentionally retains Gmail draft preparation; direct server-side delivery would be separate work.


## Light and dark appearance

Added a sun/moon toggle to the shared top bar on desktop and mobile. The first visit follows the system color preference; choosing a mode saves it locally and applies it across pages and returning visits. System changes are followed until a manual choice is saved. Storage failures are handled gracefully.

`assets/js/theme.js` applies the mode before the styles render. `assets/css/themes.css` supplies the light appearance for the shell, panels, controls, forms, diagrams, command palette, and legacy content pages. Original project imagery remains unchanged. The printable resume keeps its independent print layout.

Verified switching, saved preference on reload and route navigation, system preference changes, keyboard activation, and light-mode layouts at 1440, 390 and 320px. Axe checks on light-mode workspaces and representative content pages passed at desktop/mobile sizes, including the command palette. No page errors were observed. Seven regression tests and syntax checks pass. Changes remain local.


## Product visual refinement

See `UI-REFINEMENT.md` for the current design, animation architecture, validation, and performance results. The baseline scores above predate this refinement.

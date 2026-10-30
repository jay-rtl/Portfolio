# Obsidian Glass: Local Review

Review date: October 30, 2026.

Publication note: the user subsequently authorized GitHub Pages deployment on
October 30, 2026. The local-only statements below describe the earlier review
phase. This release includes the independent pages, dark-only seam fix,
automatic scene playback without a floating control, and Space Grotesk hero name.
The previously documented performance and development-tool findings remain open;
deployment approval is not a claim that those targets have been satisfied.

Branch: `feature/obsidian-glass-redesign`.
Baseline: `c14662e` (the previously published Davis screenshot update).

Local preview: http://localhost:4321/
Start command: `npm run dev`.

No commit, push, release, deployment, remote setting, DNS change, or public upload
was performed for this redesign. The existing live website is unchanged.

## Creative Direction

An architectural silver-on-obsidian landscape frames Francis's real work, with
glass as a material rather than a container for every section.

The attached reference guided composition, tonal contrast, a fixed left capsule
sidebar, oversized two-line identity, reflected surfaces, and a floating showcase.
The reference image is not used as a website background. Its incorrect surname,
experience claims, and satisfaction percentage were not copied.

Two signature moments carry the direction:

1. A full-bleed original landscape with live physical glass, an orbital line,
   subtle pointer response, and an accessible HTML showcase of actual projects.
2. Restrained editorial sections with directional mask reveals, service rows,
   real project images, readable client feedback, and a direct enquiry flow.

Body typography uses the local system sans-serif stack; the hero name now uses
self-hosted Space Grotesk. Type sizes use explicit
responsive breakpoints, not viewport-scaled text. The interface uses black,
charcoal, silver, and white; real portfolio screenshots retain their own branding.

## Implementation

The static multipage architecture is retained. No framework migration, backend,
database, external runtime CDN, analytics service, or contact integration was added.

- `assets/js/obsidian-components.js`: shared glass navigation, FJR brand, hero,
  live-project showcase markup, footer, and real clock/date access.
- `assets/css/obsidian.css`: neutral tokens, material treatments, desktop and
  dedicated mobile navigation, all section/page styling, dark-only appearance,
  touch layouts, and reduced-motion styling.
- `assets/js/obsidian.js`: GSAP/ScrollTrigger orchestration, featured project
  selection, mobile focus/inertness, lazy 3D loading,
  automatic scene playback and motion fallbacks.
- `assets/js/obsidian-scene.js`: Three.js physical transmission/reflections,
  camera-aligned environment for refraction, architectural geometry, orbital line,
  pointer parallax, offscreen/tab pausing, resize handling, and resource disposal.
- `assets/css/resume-obsidian.css`: neutral screen presentation of the printable
  resume. Existing light print styling and resume content remain available.
- `scripts/workspace-content.mjs`: generates eight independent main pages and primary content
  for all eleven case studies. Case studies no longer require JavaScript to read.
- `scripts/vendor-motion.mjs`: copies the existing pinned GSAP runtime, its
  ScrollTrigger plugin, and bundles the Three.js scene locally.
- `scripts/build.mjs`: minifies production CSS/JS in `dist/`, leaving source
  readable and the existing public-file whitelist intact.
- HTML wrappers load the shared design/behaviour and matching FJR favicon.
- Main navigation now opens independent pages; scrolling never changes the page
  or active navigation entry. Home contains only the hero. Regression/browser
  tests cover native routes and retained interactions.

Pinned production dependencies: GSAP 3.15.0 and Three.js 0.186.1.
esbuild 0.28.2 is a development-only minification/bundling tool.

## Preserved Content And Behaviour

- All 11 existing projects, screenshots, live links, and case-study routes.
- All four full client testimonials, with no invented or edited endorsements.
- SuroyTabai founder role, description, and https://suroytabai.com/ link.
- Biography, experience timeline, technical skills, education, and credentials.
- Contact details, service choices, budget choices, pricing, and printable resume.
- Project selection, filters, search, keyboard tabs, direct mobile project cards,
  system controls, technology categories, testimonial controls/swipe/drag,
  command search and a Philippines date/12-hour clock. Light mode was removed at
  the user's subsequent request; old saved theme choices are ignored.
- Existing canonical metadata, sharing image references, sitemap, robots file,
  domain file, verification file, and current GitHub Pages configuration.

`assets/js/data.js` and `assets/js/workspace-data.js` are unchanged from the
baseline. No existing project was removed or presented as newly completed.

## Motion And Progressive Enhancement

| Interaction | Trigger and behaviour | Fallback |
| --- | --- | --- |
| Hero identity | Desktop first view; masked 1.25s line reveal with a short stagger | Immediate text on mobile, reduced motion, and no JS |
| Section transitions | On entry; 0.9s directional/clip reveal, once per element | Static readable content |
| Featured work | Previous/next buttons; real image/title/link updates, no autoplay | First real project remains linked without JS |
| Glass scene | Lazy desktop load after the HTML entrance; subtle float/parallax | Original environment plate and functional HTML showcase |
| Phone | Scene starts automatically after the readable HTML entrance | Same environment and project controls without WebGL |
| Ambient movement | Automatic playback; pauses offscreen and when tab is hidden | Reduced motion disposes the canvas |
| Mobile menu | Dedicated drawer, Escape, focus boundary, inert background | Crawlable fallback navigation on every primary/case-study page without JS |

Scene rendering is bounded to DPR 1.25 on desktop and 1 on mobile. Transmission
resolution and environment-map size are limited. Frame scheduling is bounded;
this is an implementation target, not a physical-device FPS claim.

The scene uses real Three.js geometry/materials, not a flat screenshot of a UI.
Navigation, names, descriptions, links, and project controls are actual HTML.
No scroll-hijacking library or fabricated loading progress is used.

## Assets

Original generated artwork was made with the built-in image-generation tool,
then copied into the project as optimized WebP assets. It is an atmospheric CGI
environment, not a claim about a real location or a completed client project.

| Asset | Purpose |
| --- | --- |
| `img/obsidian-environment.webp` | Original desktop rock/water environment, 183,802 bytes |
| `img/obsidian-environment-small.webp` | Responsive environment, 59,236 bytes |
| `img/acerbox-builds-hero.webp` | Derived mobile showcase preview, 18,652 bytes |
| `img/davis-pest-solutions-hero.webp` | Derived mobile showcase preview, 24,670 bytes |
| `img/ihelp-friendship-hero.webp` | Derived mobile showcase preview, 31,000 bytes |
| `img/favicon/fjr-mark.svg` and 16/32/180 PNGs | Code-native neutral FJR brand mark |

Original client screenshots remain untouched. Small showcase previews are not
substituted for the full project explorer/case-study images.

### Final Environment Prompt

Use case: stylized-concept. Asset type: original environment plate for an
interactive 3D portfolio hero, not a website mockup. Create a photorealistic luxury
CGI landscape in strict black, graphite, silver and white ONLY. Wide cinematic
16:9 composition. A shallow reflective black lake in foreground with beautifully
detailed fractured wet obsidian rock along the lower edge. On the RIGHT HALF,
three monumental irregular black volcanic rock formations rise with sharp
architectural faces and silver rim lighting; leave a spacious, extremely dark,
low-detail LEFT HALF for separately rendered HTML headline. Distant black
mountains, subtle silver mist at the waterline, charcoal night sky with no stars,
dramatic soft studio lighting from upper right. Extremely tactile mineral
surface, fine ripples and silver specular reflections, sophisticated calm
editorial CGI, high visual fidelity. The right-side formations should fill about
60 percent of image height, foreground depth feels immersive. No glass spheres,
no orbs, no rings, no graphics, no UI, no screens, no cards, no letters, no logos,
no text, no people, no colorful lighting, no purple/blue tint. The scene is
background environment only; real glass geometry, rings, navigation, text, and
project showcase will be rendered independently in live code.

## Privacy And Security Scope

The contact form still prepares a Gmail draft; it does not send a message or
store a submission on this website. The visitor must review and send in Gmail.
The draft URL contains the entered details, so Google/browser history may process
those details. That pre-existing integration was preserved, not redesigned.
Tests intercept the navigation and do not send an email or a real enquiry.

New art, JavaScript, and library assets are served locally. The dark-only site does
not read or write a theme preference; no new optional tracking was added. Existing
external links and the printable resume's pre-existing font request are retained.
This review is not a privacy-law or complete security certification.

`npm audit --omit=dev --json` reported zero production dependency advisories at
the time of review. Full `npm audit --json` reported four development-tool
dependency findings: fast-uri (moderate), and zod/chromium-bidi/puppeteer-core
(high, including propagated findings). No blanket automatic dependency update
was applied. These tools are not shipped as application runtime dependencies.

## Verification And Review Gate

Repeatable commands:

```powershell
npm run generate
npm run build
npm run lint
npm test
npm run test:browser
npm run test:refinement
npm run test:obsidian
npm run test:navigation
npm run audit
npm run dev
```

Screenshots and machine-readable reports are in ignored `.preview/`. Review
includes Chrome desktop/tablet/mobile emulation, canvas pixels and moving frames,
actual project images and links, keyboard controls, no-JavaScript content,
reduced-motion behaviour, and WebGL-unavailable fallbacks. Automated accessibility
scans do not establish full WCAG conformance. Physical devices and Safari/Firefox
remain unverified.

Lighthouse is measured locally, not against production field data. Raw development
server and optimized/gzip production-build runs are different environments and
must not be presented as directly comparable before/after results. Desktop
shader startup and local machine conditions have produced variable performance
scores. Production performance and INP field data are not verified.

Status: READY FOR REVIEW, not a statement that every production performance target
or legal/accessibility requirement has been satisfied. Review locally before
any separately authorized commit, push, or deployment.

## Completed Audit Matrix

| Category | Status | Executed scope and evidence |
| --- | --- | --- |
| Functionality | PASS | 21 public routes and collected local links; filters, keyboard controls, mobile menu, carousel, command search, and intercepted Gmail draft. All eight main pages remain isolated when scrolled at 1440/390/320px; old hash URLs and subdirectory links redirect correctly. The nine external project URLs returned HTTP 200 during the earlier review, not rechecked for this navigation follow-up |
| SEO | PASS | Unique metadata and canonicals for the new Skills/Testimonials pages; sitemap includes 21 canonical URLs; all 11 case studies retain generated primary HTML. Earlier local Lighthouse SEO 100 is historical, not a new audit or production indexing validation |
| Responsive/visual | PASS | Screenshots and overflow checks at 1920/1672/1440/1024/768/430/390/320px as covered by the suites; actual hero compared with the attached reference, not claimed as an exact reproduction |
| Accessibility: executed checks | PASS | Dark representative axe scans, keyboard controls, Escape, inert mobile background, readable alt text, reduced motion, and static fallbacks; no claim of complete WCAG conformance |
| Accessibility: physical assistive technology | NOT TESTED | No physical screen-reader or touch-device review |
| Security/privacy: production dependencies | PASS | Production-only npm audit reported no advisories; no new tracking or submission endpoint |
| Security/privacy: development tooling | FAIL | Four existing development dependency advisories remain; full security and legal review not performed |
| Performance targets | FAIL | Latest optimized/gzip localhost run: mobile 57 (LCP 3.2s, TBT 2550ms, CLS 0); desktop 65 (LCP 1.3s, TBT 1060ms, CLS 0). Earlier production-like runs varied substantially. Mobile startup and desktop shader cost need further profiling; lab targets are not reliably satisfied |
| Performance: production field data | NOT TESTED | No production deployment, real-user INP, 75th-percentile data, or physical-device timing |
| Code/regression | PASS | Build, lint for 27 JS files, 13 unit tests, broad browser/interaction suite, refinement suite, Obsidian canvas/pixel/fallback suite, independent-page navigation suite, and whitespace checks |

The optimized/gzip lab used headless Chrome 156, Lighthouse 13.5.0, emulated mobile
and desktop configurations, and only a localhost copy of the production `dist/`
output. It is not a live GitHub Pages measurement. Earlier raw/uncompressed
development-server runs were also recorded during diagnosis, not substituted as
the final production-like result. Performance remains an honest open item.

An earlier theme/print review generated a local A4 resume PDF with a white paper
background and neutral ink. Light UI mode was subsequently removed; the light
print paper is intentionally retained for readable printing. No email was sent.

Browser reports and screenshots:

- `.preview/browser-qa.json`
- `.preview/refinement-qa.json`
- `.preview/obsidian-qa.json`
- `.preview/navigation-qa.json` and `.preview/separate-about-1440.png`,
  `.preview/separate-about-390.png`
- `.preview/obsidian-external-links.json`
- `.preview/lighthouse-mobile.json` and `.preview/lighthouse-desktop.json`
- `.preview/obsidian-review-desktop.png`, `obsidian-review-tablet.png`, and
  `obsidian-review-mobile.png` (historical capture before phone autoplay)
- `.preview/obsidian-resume-screen.png` and `.preview/obsidian-resume-print.pdf`

Outstanding: approve the visual direction locally, profile the remaining startup
cost on physical devices, review the development dependency findings, and test
Safari/Firefox and real assistive technology before a separately approved launch.

The production-like lab command was:

```powershell
node .preview/serve-built.mjs
# In another terminal:
$env:PREVIEW_URL='http://localhost:4322/'
node scripts/lighthouse-qa.mjs
```

The temporary server serves only the whitelisted `dist/` output on loopback with
gzip. It is a measurement harness, not a new hosting service or production change.

No commit/push/deployment has been made. The localhost development preview is
left running for review; the temporary performance-lab server is not a public
host and is stopped after measurements.

## Seam And Dark-Only Follow-Up

The visible vertical seam came from drawing a second, tone-mapped landscape over
the HTML background. The environment plane is now included only in the glass
transmission render target; the main canvas stays transparent outside 3D objects.
This retains refraction without repainting a differently processed rectangle.

Pixel comparison along the canvas boundary measured zero difference before and
after scene initialization (1,272 RGB-channel samples). Desktop screenshots and
1440/1024/390/320px checks confirmed no overflow or browser errors.

The theme toggle and light skin were removed. Even with a light system preference
and an old saved light preference, the home, About, Contact, and Davis case page
remain dark. Asset cache versions were updated to 41. Existing content, metadata,
project links, and the contact integration were not changed in this follow-up.

Checks: `npm run build`, `npm run lint`, `npm test` (12 tests),
`npm run test:obsidian`, and `node .preview/obsidian-seam-dark-review.mjs`.
Screenshots/report: `.preview/obsidian-seam-fixed-desktop.png`,
`.preview/obsidian-dark-only-mobile.png`, and
`.preview/obsidian-seam-dark-review.json`.

No new performance or security audit was run for these two narrow changes. The
earlier performance and development-tool advisory caveats remain open. No push,
commit, or deployment was performed.

## Independent Navigation Follow-Up

Each main navigation entry now has its own page: Home `/`, About `/about/`,
Projects `/work/`, Services `/services/`, Skills `/skills/`, Systems `/systems/`,
Testimonials `/testimonials/`, and Contact `/contact/`. About keeps its biography,
experience, process, skills, and credentials, but contains no Projects section.
Home contains only its cinematic hero and links into the other pages. Scrolling
never switches sections, changes the URL, or changes the active menu entry.

Desktop navigation, mobile drawer/quick navigation, hero buttons, and command
search all use native page links. Legacy homepage hash links redirect to the
corresponding page, including `/Portfolio/` subdirectory previews. Project query
parameters survive that redirect. Every main/case-study page provides a fallback
navigation when JavaScript is disabled. Asset cache versions are now 42.

New files: `skills/index.html`, `testimonials/index.html`, and
`scripts/navigation-qa.mjs`. Shared navigation, route handling, generators,
public-file whitelist, sitemap, styles, HTML wrappers, and browser/unit tests
were updated. No project data or client testimonials were changed.

The dedicated navigation suite checks all eight pages at 1440/390/320px,
foreign-section absence, scrolling to the bottom without switching pages,
correct active navigation, no overflow, command search, legacy links at both
root/subdirectory, and no-JavaScript content/navigation. Representative About,
Projects, Skills, and Testimonials viewport screenshots are saved under
`.preview/separate-*.png`.

Local build, lint, 13 unit tests, navigation, broad browser/interaction,
refinement, and Obsidian suites pass. Browser reports contain no runtime errors;
the executed axe scans report no violations. These checks use headless desktop
Chrome and viewport emulation, not physical devices. No new performance or
dependency audit was run for this routing change; the earlier open findings
remain. Local preview stays at http://localhost:4321/ (`npm run dev`).

Status: READY FOR REVIEW. Nothing was committed, pushed, or deployed.

## Automatic Scene Playback Follow-Up

The floating play/pause button was removed from the hero markup and its styles
and event handlers were deleted. The 3D scene now starts automatically on desktop
and phone after the readable HTML entrance; no enable click is required. The
unused manual pause API was also removed from the renderer. Asset cache versions
are now 43, including the bundled scene import.

The scene still stops rendering when out of view or the tab is hidden, disposes
resources when leaving the page, and uses the static landscape for reduced motion
or unavailable WebGL. Changing reduced-motion preferences updates the scene at
runtime. Project previous/next controls remain available and separate from the
removed ambient-motion button.

Autoplay on phones changes the earlier opt-in performance tradeoff. No new
Lighthouse or physical-device performance measurement was made for this change;
the earlier performance concerns and development dependency findings remain open.
The updated browser suite checks automatic frame advancement and absence of the
button at all six representative widths, alongside the existing fallbacks.

Checks completed: `npm run generate`, `npm run lint` (27 JavaScript files),
`npm test` (13 passed), `npm run build`, `npm run test:obsidian`, and
`git diff --check`. The browser suite passed at 1672/1440/1024/768/390/320px,
including runtime reduced-motion changes and automatic restart. No reported
runtime errors or executed axe violations. Desktop and phone hero screenshots
were visually reviewed; the floating motion button is absent. Real-device timing
and complete accessibility conformance remain unverified.

No push, commit, deployment, or public upload was performed. Local preview remains
http://localhost:4321/ (`npm run dev`).

## Intro Font Follow-Up

Only the hero name's typography changed: Space Grotesk replaces Segoe UI, with
tighter letter spacing and a regular-weight surname instead of the previous thin
surname. The existing sizes, two-line arrangement, colors, other page typography,
content, and animation remain in place.

The Latin variable WOFF2 is self-hosted at
`assets/fonts/space-grotesk-latin-variable.woff2` (22,288 bytes), with the original
SIL Open Font License at `assets/fonts/Space-Grotesk-OFL.txt`. The font came from
Google Fonts' Space Grotesk distribution; the license was retrieved from
`https://raw.githubusercontent.com/google/fonts/main/ofl/spacegrotesk/OFL.txt`.
Visitors do not request Google Fonts. Home preloads the font, the CSS uses
`font-display:swap`, and Arial/Helvetica remain fallback faces. Cache versions for
the HTML-loaded assets are now 44. The local preview serves WOFF2 as `font/woff2`.

Files: `assets/css/obsidian.css`, regenerated `workspace-bundle.css`,
`assets/fonts/`, `index.html`, HTML cache references, and `scripts/serve.mjs`.

### Scoped Verification

| Category | Status | Evidence |
| --- | --- | --- |
| Functionality | PASS | Local font returned HTTP 200 as font/woff2; font face loaded; hero text and automatic scene playback remain functional |
| SEO | PASS | Existing metadata/canonical/social-preview unit checks pass; no indexing claims |
| Responsive/Visual | PASS | Name fits without clipping and no horizontal overflow at 1920/1440/1024/768/390/320px; desktop/phone screenshots visually reviewed |
| Accessibility: executed scope | PASS | Semantic name remains text; regular surname weight is readable in reviewed screenshots; reduced-motion static view retained |
| Accessibility: full review | NOT TESTED | No new screen-reader, keyboard, contrast, or complete conformance audit for this font change |
| Security/Privacy: font delivery | PASS | Font is served from local assets without a new third-party runtime request; license retained |
| Security/Privacy: broader audit | NOT TESTED | No new dependency/security/legal audit; previous development-tool advisories remain open |
| Performance | NOT TESTED | New font is 22,288 bytes and preloaded; no new Lighthouse or physical-device timing; earlier performance concerns remain open |
| Code/Regression | PASS | Lint for 27 JavaScript files, 13 passing unit tests, successful build, font-focused Chrome checks, and whitespace check |

Commands: `npm run lint`, `npm test`, `npm run build`,
`node .preview/font-review.mjs`, and `git diff --check`. Browser review used
headless Chrome and emulated viewport sizes. The report is
`.preview/font-review.json`; screenshots are `.preview/hero-space-grotesk-*.png`.
No browser runtime errors were reported in this check.

Status: READY FOR REVIEW. Next action: review the name at
http://localhost:4321/. Preview start command: `npm run dev`.
Nothing was committed, pushed, or deployed.

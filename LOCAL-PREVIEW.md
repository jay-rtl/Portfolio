# Local preview and validation

Node.js 18+ runs the static preview, generation, tests and build. Browser QA uses Node.js 22+ and installed Google Chrome.

```powershell
npm.cmd run dev
```

Open **http://localhost:4321/**. The server binds only to this machine. For another port, use `npm.cmd run dev -- --port 4322`.

The homepage is an application workspace. Try Projects, Systems, Testimonials and Contact, or press **Ctrl+K / Cmd+K**. Resume remains directly accessible from the top bar. Mobile uses bottom navigation; the search button opens all sections and resources.

## Content and components

- `assets/js/data.js`: original project, pricing, expertise and technology data.
- `assets/js/workspace-data.js`: client quotes, service modules, profile, timeline and verified social links.
- `assets/js/workspace-components.js`: reusable HTML renderers used both for static generation and browser updates.
- `assets/js/workspace.js`: workspace navigation, project search, tabs, carousel, swipe and command palette.
- `assets/css/workspace.css`: application shell and design tokens.

After changing data or component templates, regenerate the five static workspace pages:

```powershell
npm.cmd run generate
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

Generation retains page heads and metadata. Build copies public files into ignored `dist/`. Neither command publishes anything. Existing routes and the `/Portfolio/` base path remain supported.

## Browser QA (development dependencies only)

```powershell
npm.cmd ci --cache .preview/npm-cache
npm.cmd run test:browser
npm.cmd run audit
```

Keep the local server running for these commands. Chrome must be installed. Browser tests intercept Gmail navigation; they never send an email. Screenshots and JSON reports are saved in ignored `.preview/`.

The website has no runtime npm dependencies and loads no external font or animation library. The form prepares a Gmail draft for the visitor to review and send. There is no server-side submission endpoint.

See `WORKSPACE-REDESIGN.md` for the redesign architecture, verification and file inventory. Do not publish until the redesign is explicitly approved.


Latest visual refinement: see `UI-REFINEMENT.md`. Run `npm.cmd run test:refinement` for the added interaction and dark-theme checks. `npm.cmd run build` copies the pinned local GSAP runtime before building. No CDN is required.

# Local Preview

Requires Node.js 18 or newer. No dependency installation is needed.

~~~powershell
npm run dev
~~~

Open http://localhost:4321/. The preview binds only to this machine.
If that port is occupied, use: npm run dev -- --port 4322.

~~~powershell
npm run lint
npm test
npm run build
~~~

The build copies public files into the ignored dist/ folder.
These commands do not commit, push, upload, or deploy anything.
The existing static pages also work at the /Portfolio/ base path.

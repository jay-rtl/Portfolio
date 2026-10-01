import './style-bundle.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { root } from './project.mjs';

// Generate meaningful static workspace content from the same components used in the browser.
// Existing metadata and routes remain in their HTML files; no deployment files are touched.
function components(prefix) {
  const context = { window: {}, URL };
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  context.window.PORTFOLIO_UI = { escape, href: route => prefix + route.slice(1) };
  vm.createContext(context);
  for (const file of ['data.js','workspace-data.js','workspace-components.js']) {
    vm.runInContext(readFileSync(path.join(root,'assets/js',file),'utf8'), context);
  }
  return { C: context.window.WORKSPACE_COMPONENTS, D: context.window.WORKSPACE_DATA, projects: context.window.PORTFOLIO_DATA.projects };
}
for (const [file,kind] of [['index.html','home'],['work/index.html','projects'],['services/index.html','services'],['systems/index.html','systems'],['contact/index.html','contact']]) {
  const prefix=kind==='home'?'':'../';
  const { C,D,projects }=components(prefix);
  const explorer=()=>C.sectionHead('PROJECT EXPLORER / 09 PROJECTS','Built for the real world.','Select a project to explore the interface, the challenge, and the thinking behind it.')+C.projectExplorer()+'<noscript><nav aria-label="All case studies">'+projects.map(p=>'<p><a href="'+prefix+'work/'+p.slug+'/">'+p.title+'</a></p>').join('')+'</nav></noscript>';
  const views={overview:C.overview,projects:explorer,systems:C.systems,services:C.services,stack:C.stack,about:C.about,testimonials:C.testimonials,contact:C.contact};
  let content;
  if(kind==='home') content=C.nav.map(([id])=>'<section id="'+id+'" class="workspace-view" data-workspace-view aria-label="'+C.nav.find(([key])=>key===id)[1]+'">'+(id==='overview'?views[id]():views[id]().replace('<h2 tabindex="-1">','<h1 tabindex="-1">').replace('</h2>','</h1>'))+'</section>').join('\n');
  else {
    content=views[kind]();
    content=content.replace('<h2 tabindex="-1">','<h1 tabindex="-1">').replace('</h2>','</h1>');
    if(kind==='systems') content+='<details class="glass-panel scope-notes" id="scope"><summary>Experience, concepts & custom scope</summary>'+D.systemScopeHtml+'</details>';
  }
  const target=path.join(root,file);
  let html=readFileSync(target,'utf8');
  const scripts=(html.slice(html.indexOf('<body')).match(/<script src="[^"]+"><\/script>/g)||[]).join('');
  html=html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/,'<main id="main" tabindex="-1">'+content+'</main>');
  // Replace only homepage body; the existing head (SEO, social cards, schema) remains intact.
  if(kind==='home') html=html.slice(0,html.indexOf('<body'))+'<body data-home data-workspace="overview"><a class="skip-link" href="#main">Skip to content</a><noscript><nav class="fallback-navigation" aria-label="Workspace navigation">'+C.nav.map(([id,label])=>'<a href="#'+id+'">'+label+'</a>').join('')+'</nav></noscript><div data-header></div><main id="main" tabindex="-1">'+content+'</main><div data-footer></div>'+scripts+'</body></html>\n';
  writeFileSync(target,html.replace(/[ \t]+$/gm,''));
}
console.log('Generated five static workspace pages from shared data and components.');

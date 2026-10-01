import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const b=await chromium.launch({channel:'chrome',headless:true});
const c=await b.newContext({colorScheme:'dark',viewport:{width:1440,height:1000}}),p=await c.newPage();
const errors=[],violations=[];p.on('pageerror',e=>errors.push(e.message));
await p.addInitScript(()=>sessionStorage.setItem('francis-workspace-v2','seen'));
try{
 for(const width of [1440,390]){
  await p.setViewportSize({width,height:1000});
  for(const id of ['overview','projects','systems','services','stack','about','testimonials','contact']){
   await p.goto('http://localhost:4321/#'+id);await p.waitForTimeout(700);
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id+' overflow');
   const audit=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   violations.push(...audit.violations.map(v=>({width,id,rule:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
   if(['overview','systems','services'].includes(id))await p.screenshot({path:'.preview/refined-'+id+'-'+width+'.png',fullPage:true});
  }
 }
 await p.setViewportSize({width:1024,height:1000});await p.goto('http://localhost:4321/');
 await p.locator('.sidebar-toggle').click();assert.equal(await p.locator('.app-sidebar').isVisible(),false);assert.equal(await p.locator('.sidebar-toggle').getAttribute('aria-expanded'),'false');
 await p.locator('.sidebar-toggle').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('.app-sidebar').isVisible(),true);
 await p.locator('.workspace-nav [data-nav=systems]').click();await p.waitForTimeout(500);
 await p.locator('[data-architecture-node="2"]').focus();assert.match(await p.locator('.architecture-description').innerText(),/collect the request/);assert.equal(await p.locator('.architecture-steps .is-related').count(),3);await p.keyboard.press('ArrowRight');assert.match(await p.locator('.architecture-description').innerText(),/shared view/);
 await p.goto('http://localhost:4321/#stack');await p.locator('[data-cluster="2"]').focus();assert.equal(await p.locator('.stack-catalog .is-related').count(),1);
 await p.goto('http://localhost:4321/#about');await p.locator('.profile-timeline').scrollIntoViewIfNeeded();await p.waitForTimeout(100);assert(await p.locator('.profile-timeline').evaluate(el=>Number(el.style.getPropertyValue('--timeline-progress')))>0);
 await p.goto('http://localhost:4321/#testimonials');await p.waitForTimeout(600);const quote=await p.locator('.feedback-slide:visible blockquote').boundingBox();await p.mouse.move(quote.x+quote.width*.8,quote.y+30);await p.mouse.down();await p.mouse.move(quote.x+quote.width*.2,quote.y+30,{steps:8});await p.mouse.up();assert.equal(await p.locator('.feedback-slide:visible cite').innerText(),'Acerbox Builds');
 await p.goto('http://localhost:4321/#overview');await p.waitForTimeout(700);assert.match(await p.locator('.availability-clock time').innerText(),/^\d\d:\d\d$/);
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(100);assert.equal(await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);assert.equal(await p.evaluate(()=>gsap.globalTimeline.getChildren().filter(t=>t.isActive()).length),0);
 await p.goto('http://localhost:4321/Portfolio/#projects');assert.equal(await p.locator('[data-project-tone]').count(),1);
 writeFileSync('.preview/refinement-qa.json',JSON.stringify({errors,violations},null,2));assert.deepEqual(errors,[]);assert.deepEqual(violations,[]);console.log('PASS dark desktop/mobile accessibility, tablet toggle, architecture keyboard, clusters, timeline, clock, reduced motion and subdirectory.');
}finally{await b.close();}

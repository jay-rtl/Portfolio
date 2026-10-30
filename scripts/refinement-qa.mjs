import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const b=await chromium.launch({channel:'chrome',headless:true});
const c=await b.newContext({colorScheme:'dark',viewport:{width:1440,height:1000}}),p=await c.newPage();
const errors=[],violations=[];p.on('pageerror',e=>errors.push(e.message));
const routes={overview:'/',projects:'/work/',systems:'/systems/',services:'/services/',stack:'/skills/',about:'/about/',testimonials:'/testimonials/',contact:'/contact/'};
await p.addInitScript(()=>sessionStorage.setItem('francis-workspace-v2','seen'));
try{
 for(const width of [1440,390]){
  await p.setViewportSize({width,height:1000});
  for(const id of ['overview','projects','systems','services','stack','about','testimonials','contact']){
   await p.goto('http://localhost:4321'+routes[id]);await p.waitForTimeout(700);
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id+' overflow');
   const audit=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   violations.push(...audit.violations.map(v=>({width,id,rule:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
   if(['overview','systems','services'].includes(id))await p.screenshot({path:'.preview/refined-'+id+'-'+width+'.png',fullPage:true});
  }
 }
 await p.setViewportSize({width:1024,height:1000});await p.goto('http://localhost:4321/');
 assert.equal(await p.locator('.app-sidebar').isVisible(),true);assert.equal(await p.locator('.app-sidebar').evaluate(el=>getComputedStyle(el).position),'fixed');
 await p.locator('.workspace-nav [data-nav=systems]').click();await p.waitForTimeout(500);
 await p.locator('[data-architecture-node="2"]').focus();assert.match(await p.locator('.architecture-description').innerText(),/collect the request/);assert.equal(await p.locator('.architecture-steps .is-related').count(),3);await p.keyboard.press('ArrowRight');assert.match(await p.locator('.architecture-description').innerText(),/shared view/);
 await p.goto('http://localhost:4321/skills/');await p.locator('[data-cluster="2"]').focus();assert.equal(await p.locator('.stack-catalog .is-related').count(),1);
 await p.goto('http://localhost:4321/about/');await p.locator('.profile-timeline').scrollIntoViewIfNeeded();await p.waitForTimeout(100);assert(await p.locator('.profile-timeline').evaluate(el=>Number(el.style.getPropertyValue('--timeline-progress')))>0);
 await p.goto('http://localhost:4321/testimonials/');await p.locator('.feedback-slide:visible blockquote').scrollIntoViewIfNeeded();await p.waitForTimeout(1000);const quote=await p.locator('.feedback-slide:visible blockquote').boundingBox();await p.mouse.move(quote.x+quote.width*.8,quote.y+30);await p.mouse.down();await p.mouse.move(quote.x+quote.width*.2,quote.y+30,{steps:8});await p.mouse.up();assert.equal(await p.locator('.feedback-slide:visible cite').innerText(),'Acerbox Builds');
 await p.goto('http://localhost:4321/');await p.waitForTimeout(700);assert.match(await p.locator('[data-local-time]').first().innerText(),/^\d{1,2}:\d\d [AP]M$/);assert.match(await p.locator('[data-local-date]').first().innerText(),/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/);
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(100);assert.equal(await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);assert.equal(await p.evaluate(()=>gsap.globalTimeline.getChildren().filter(t=>t.isActive()).length),0);
 await p.goto('http://localhost:4321/Portfolio/work/');assert.equal(await p.locator('.explorer-detail [data-project-tone]').count(),1);
 writeFileSync('.preview/refinement-qa.json',JSON.stringify({errors,violations},null,2));assert.deepEqual(errors,[]);assert.deepEqual(violations,[]);console.log('PASS dark desktop/mobile accessibility, fixed tablet sidebar, architecture keyboard, clusters, timeline, clock, reduced motion and subdirectory.');
}finally{await b.close();}

import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {portfolioData} from './project.mjs';
const base=process.env.PREVIEW_URL || 'http://localhost:4321';
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[],violations=[],checks=[];
const record=(label)=>checks.push(label);
try {
  const context=await browser.newContext({viewport:{width:1672,height:941},colorScheme:'light'});
  await context.addInitScript(()=>localStorage.setItem('fjr-obsidian-theme','light'));
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.goto(base+'/');
  await page.locator('[data-hero-canvas-host][data-scene=ready]').waitFor();
  await page.waitForTimeout(1700);
  const host=page.locator('[data-hero-canvas-host]');
  const frames=Number(await host.getAttribute('data-frame'));await page.waitForTimeout(180);
  assert(Number(await host.getAttribute('data-frame'))>frames,'3D scene animates');record('WebGL renders and advances');
  const canvas=await page.locator('[data-glass-canvas]').screenshot();
  const pixels=await page.evaluate(async png=>{
    const img=new Image();img.src='data:image/png;base64,'+png;await img.decode();
    const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
    const data=ctx.getImageData(0,0,c.width,c.height).data;const samples=new Set();let light=0;
    for(let i=0;i<data.length;i+=160){samples.add(data.slice(i,i+3).join(','));if(data[i]>30)light++;}
    return {colors:samples.size,light};
  },canvas.toString('base64'));
  assert(pixels.colors>100&&pixels.light>100,'canvas pixels are nonblank');record('Canvas screenshot pixel check');
  await page.mouse.move(1300,220);await page.waitForTimeout(200);await page.mouse.move(900,500);record('Mouse parallax exercised');
  await page.locator('[data-hero-next]').click();assert.equal(await page.locator('[data-hero-project-title]').innerText(),'Davis Pest Solutions');
  assert((await page.locator('[data-hero-project-link]').first().getAttribute('href')).endsWith('/work/davis-pest-solutions/'));
  await page.locator('[data-hero-prev]').click();assert.equal(await page.locator('[data-hero-project-title]').innerText(),'Acerbox Builds');record('Live project showcase controls');
  assert.equal(await page.locator('[data-scene-motion],.scene-motion-toggle').count(),0);record('No play/pause button; scene starts automatically');
  for(const [width,height] of [[1672,941],[1440,900],[1024,900],[768,1000],[390,844],[320,800]]) {
    await page.setViewportSize({width,height});await page.goto(base+'/');await page.waitForTimeout(1400);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
    assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
    assert.equal(await page.locator('[data-theme-toggle]').count(),0);
    assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.locator('[data-scene-motion],.scene-motion-toggle').count(),0);
    await page.locator('[data-hero-canvas-host][data-scene=ready]').waitFor();
    const box=await page.locator('[data-glass-canvas]').boundingBox();assert(box.width>200&&box.height>200);
    const frameBefore=Number(await page.locator('[data-hero-canvas-host]').getAttribute('data-frame'));
    await page.waitForTimeout(180);
    assert(Number(await page.locator('[data-hero-canvas-host]').getAttribute('data-frame'))>frameBefore,'Autoplay at '+width+'px');
    await page.screenshot({path:'.preview/obsidian-hero-'+width+'.png'});
    for(const id of ['projects','services','about','stack','testimonials','contact']) {
      const route={projects:'/work/',services:'/services/',about:'/about/',stack:'/skills/',testimonials:'/testimonials/',contact:'/contact/'}[id];
      await page.goto(base+route);await page.waitForTimeout(160);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id+' overflow '+width);
      if([1440,390].includes(width)&&['services','about','testimonials','contact'].includes(id))await page.locator('main').screenshot({path:'.preview/obsidian-'+id+'-'+width+'.png'});
    }
    if([1440,390].includes(width)){
      const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      violations.push(...result.violations.map(v=>({width,id:v.id,nodes:v.nodes.map(n=>({target:n.target,message:n.failureSummary}))})));
    }
    console.log('Obsidian rendered widths:',width);
  }
  record('Automatic animated scene with no button at six desktop/tablet/mobile widths');
  await page.setViewportSize({width:390,height:844});await page.goto(base+'/');
  await page.locator('.sidebar-toggle').click();assert.equal(await page.locator('.sidebar-toggle').getAttribute('aria-expanded'),'true');
  assert(await page.locator('main').evaluate(el=>el.inert));
  await page.keyboard.press('Escape');assert.equal(await page.locator('.sidebar-toggle').getAttribute('aria-expanded'),'false');
  assert.equal(await page.locator('main').evaluate(el=>el.inert),false);record('Mobile menu, Escape, and background inertness');
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(200);
  assert.equal(await page.locator('[data-glass-canvas]').count(),0);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('[data-hero-canvas-host][data-scene=ready]').waitFor();
  assert.equal(await page.locator('[data-glass-canvas]').count(),1);record('Automatic scene resumes after reduced-motion preference changes');
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/');await page.waitForTimeout(200);
  assert.equal(await page.locator('[data-glass-canvas]').count(),0);assert(await page.locator('.hero-name').isVisible());record('Reduced-motion static equivalent');
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const plain=await nojs.newPage();await plain.goto(base+'/');
  assert(await plain.locator('h1').isVisible());await plain.goto(base+'/work/');assert.equal(await plain.locator('.mobile-project-card').count(),portfolioData().projects.length);await plain.goto(base+'/testimonials/');assert.equal(await plain.locator('.feedback-slide').count(),4);record('No-JavaScript content retained on independent pages');
  const disabled=await chromium.launch({channel:'chrome',headless:true,args:['--disable-webgl']});
  try{const fallback=await disabled.newPage();await fallback.goto(base+'/');await fallback.waitForTimeout(500);assert(await fallback.locator('h1').isVisible());assert(await fallback.locator('.hero-environment img').evaluate(el=>el.naturalWidth>0));assert.equal(await fallback.locator('[data-glass-canvas]').count(),0);record('WebGL-unavailable environment fallback');}finally{await disabled.close();}
  assert.deepEqual(errors,[]);assert.deepEqual(violations,[]);
  writeFileSync('.preview/obsidian-qa.json',JSON.stringify({checks,errors,violations,pixels},null,2));
  console.log('PASS Obsidian composition, real WebGL pixels and motion, project controls, responsive layouts, accessibility, mobile navigation, reduced-motion/no-JS/WebGL fallbacks.');
} finally {
  writeFileSync('.preview/obsidian-qa.json',JSON.stringify({checks,errors,violations},null,2));await browser.close();
}

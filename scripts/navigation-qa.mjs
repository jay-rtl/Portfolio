import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const base=process.env.PREVIEW_URL || 'http://localhost:4321';
const pages=[['overview','/','.obsidian-hero'],['about','/about/','.profile-editorial'],['projects','/work/','[data-explorer]'],['services','/services/','.service-collection'],['stack','/skills/','[data-stack-panel]'],['systems','/systems/','.systems-layout'],['testimonials','/testimonials/','[data-testimonials]'],['contact','/contact/','#contact-form']];
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[],checks=[];
try {
  const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  for(const width of [1440,390,320]) {
    await page.setViewportSize({width,height:900});await page.goto(base+'/');
    for(const [id,route,selector] of pages) {
      if(width<=760)await page.locator('.sidebar-toggle').click();
      await page.locator('.workspace-nav [data-nav="'+id+'"]').click();
      await page.waitForURL(url=>url.pathname===route&&!url.hash);
      assert.equal(await page.locator('body').getAttribute('data-workspace'),id);
      assert.equal(await page.locator(selector).count(),1);
      for(const [other,,foreign] of pages)if(other!==id)assert.equal(await page.locator(foreign).count(),0,id+' excludes '+other);
      for(const [key,path] of pages)assert.equal(new URL(await page.locator('.workspace-nav [data-nav="'+key+'"]').getAttribute('href')).pathname,path);
      await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForTimeout(140);
      assert.equal(new URL(page.url()).pathname,route,'Scrolling stays on '+id);
      const current=await page.locator('[data-nav][aria-current]').evaluateAll(links=>links.map(link=>link.dataset.nav));
      assert(current.length>0&&current.every(value=>value===id),'Active menu stays on '+id);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      if(width!==320&&['about','projects','stack','testimonials'].includes(id)) {
        await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'});});
        await page.screenshot({path:'.preview/separate-'+id+'-'+width+'.png'});
      }
    }
    checks.push('Independent menu, content isolation, and scroll stability at '+width+'px');
  }
  await page.keyboard.press('Control+k');await page.locator('.command-dialog input').fill('skills');await page.keyboard.press('Enter');await page.waitForURL('**/skills/');
  assert.equal(await page.locator('body').getAttribute('data-workspace'),'stack');checks.push('Command palette uses page routes');
  for(const prefix of ['', '/Portfolio'])for(const [id,route] of pages.filter(([id])=>id!=='overview')) {
    await page.goto(base+prefix+'/#'+id);await page.waitForURL(url=>url.pathname===prefix+route);
    assert.equal(await page.locator('body').getAttribute('data-workspace'),id);
  }
  await page.goto(base+'/?project=tastar#projects');await page.waitForURL('**/work/?project=tastar');
  assert.equal(await page.locator('.project-preview-heading h3').textContent(),'TASTAR');checks.push('Legacy hash links and project query work at root/subdirectory');
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),plain=await nojs.newPage();
  for(const [,route,selector] of pages) {
    await plain.goto(base+route);assert(await plain.locator('h1').isVisible());assert.equal(await plain.locator(selector).count(),1);assert.equal(await plain.locator('.fallback-navigation a').count(),8);
  }
  checks.push('No-JavaScript content and native navigation across all primary pages');
  assert.deepEqual(errors,[]);
  console.log('PASS: all eight sections are independent pages; scrolling never enters another section; menu, command search, legacy links, subdirectory and no-JS navigation work.');
} finally {writeFileSync('.preview/navigation-qa.json',JSON.stringify({checks,errors},null,2));await browser.close();}

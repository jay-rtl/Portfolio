import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { portfolioData } from './project.mjs';

const base=process.env.PREVIEW_URL || 'http://localhost:4321';
mkdirSync('.preview',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();
const failures=[],errors=[],links=new Set();
const record=(condition,message)=>{if(!condition)failures.push(message);};
page.on('pageerror',error=>errors.push(error.message));
page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
await page.addInitScript(()=>sessionStorage.setItem('francis-workspace-v2','seen'));
const views=['overview','projects','systems','services','stack','about','testimonials','contact'];
const visit=async path=>{const response=await page.goto(base+path);if(response)record(response.status()===200,'HTTP '+path);};
const settle=()=>page.waitForTimeout(440);
const overflow=async label=>{
  const result=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,elements:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.right>innerWidth+2&&getComputedStyle(el).position!=='absolute'&&!el.closest('.project-options,.stack-tabs,.command-dialog');}).slice(0,6).map(el=>el.className)}));
  record(result.scroll<=result.width+1,'Overflow '+label+' '+JSON.stringify(result));
};
try {
  for(const width of [1920,1440,1024,768,430,390,320]){
    await page.setViewportSize({width,height:1000});
    await visit('/');
    for(const view of views){
      await page.evaluate(id=>{location.hash=id;},view);await settle();
      record(await page.locator('[data-workspace-view]:visible').count()===1,'Only one panel '+view);
      record(await page.locator('#'+view).isVisible(),'Visible '+view);
      await overflow(width+' '+view);
      record(await page.locator('h1:visible').count()===1,'One visible H1 '+view);
      if([1440,390].includes(width)&&['overview','projects','testimonials','contact'].includes(view))await page.screenshot({path:'.preview/'+view+'-'+width+'.png',fullPage:true});
    }
    console.log('Responsive workspaces:',width);
  }
  await page.setViewportSize({width:1440,height:1000});
  await visit('/#projects');await settle();
  for(let i=0;i<portfolioData().projects.length;i++){
    await page.locator('[data-project-index="'+i+'"]').click();
    const p=portfolioData().projects[i];
    record((await page.locator('.project-preview-heading h3').innerText())===p.title,'Project selection '+p.slug);
    const img=page.locator('.explorer-detail img');await img.scrollIntoViewIfNeeded();
    await img.evaluate(el=>el.decode());record(await img.evaluate(el=>el.naturalWidth>0),'Project image '+p.slug);
    links.add('/work/'+p.slug+'/');
  }
  await page.locator('.explorer-search input').fill('zzzzzz');
  record(await page.locator('.explorer-detail').isHidden(),'Empty project search');
  await page.locator('.explorer-search input').fill('');
  await page.locator('[data-project-filter="systems"]').click();
  record(await page.locator('[data-project-index]:visible').count()===3,'Systems filter');
  await page.locator('[data-project-filter="all"]').click();
  await page.locator('[data-project-index="0"]').focus();await page.keyboard.press('ArrowDown');
  record(await page.locator('[data-project-index="1"]').getAttribute('aria-selected')==='true','Project keyboard navigation');
  await page.keyboard.press('Control+k');
  record(await page.locator('.command-dialog').isVisible(),'Ctrl K opens search');
  await page.locator('.command-dialog input').fill('rsm');
  record((await page.locator('.command-results').innerText()).includes('Open Resume'),'Fuzzy command search');
  await page.keyboard.press('Enter');await page.waitForURL('**/resume/');
  record(await page.locator('.app-sidebar').isVisible(),'Resume shared shell');
  await page.keyboard.press('Meta+k');record(await page.locator('.command-dialog').isVisible(),'Cmd K opens search');
  await page.keyboard.press('Escape');record(!await page.locator('.command-dialog').isVisible(),'Escape closes palette');
  await page.locator('[data-open-command]').click();
  await page.locator('.command-dialog input').fill('testimonials');await page.keyboard.press('Enter');await page.waitForURL('**/#testimonials');await settle();
  await page.locator('[data-feedback-next]').click();
  record((await page.locator('.feedback-slide:visible cite').innerText())==='Acerbox Builds','Acerbox testimonial next');
  await page.locator('[data-testimonials]').focus();await page.keyboard.press('ArrowRight');
  record((await page.locator('.feedback-slide:visible cite').innerText())==='Davis Pest Solutions','Testimonial keyboard');
  await page.locator('[data-feedback-prev]').click();
  const baseline={testimonials:JSON.parse(readFileSync(new URL('../tests/fixtures/client-feedback.json',import.meta.url),'utf8'))};
  for(let i=0;i<baseline.testimonials.length;i++){
    await page.locator('[data-feedback-select="'+i+'"]').click();
    record(await page.locator('.feedback-slide:visible blockquote').innerText()===baseline.testimonials[i].quote,'Preserved quote '+i);
  }
  await visit('/#systems');await settle();
  const flow=page.locator('#systems [data-flow]');
  await flow.locator('[role=tab]').first().focus();await page.keyboard.press('ArrowRight');
  record((await flow.locator('[role=tabpanel]').innerText()).includes('Automation and process'),'Flow keyboard');
  await visit('/#stack');await settle();
  await page.locator('[data-stack-index="5"]').click();
  record((await page.locator('#stack-detail').innerText()).includes('CURRENTLY LEARNING'),'Exploring distinction');
  await visit('/#services');await settle();
  await page.locator('.service-module summary').first().focus();
  const wasOpen=await page.locator('.service-module details').first().getAttribute('open')!==null;
  await page.keyboard.press('Enter');
  record((await page.locator('.service-module details').first().getAttribute('open')!==null)!==wasOpen,'Service module keyboard toggles details');
  await visit('/contact/?type=Automation%20%26%20Integrations');
  record(await page.locator('[name=projectType]').inputValue()==='Automation','Service prefills form');
  await page.locator('button[type=submit]').click();
  record((await page.locator('.form-status').innerText()).includes('required'),'Required field feedback');
  await page.locator('[name=name]').fill('Local QA');
  await page.locator('[name=email]').fill('qa@example.com');
  await page.locator('[name=company]').fill('Local test');
  await page.locator('[name=budget]').selectOption('Not sure yet');
  await page.locator('[name=details]').fill('A local test of the project enquiry draft.');
  let mailUrl;
  await page.route('https://mail.google.com/**',route=>{mailUrl=route.request().url();return route.fulfill({body:'Local intercepted draft — no email sent.',contentType:'text/plain'});});
  await page.locator('button[type=submit]').click();await page.waitForURL('https://mail.google.com/**');
  record(new URL(mailUrl).searchParams.get('to')==='rotoljay03@gmail.com','Correct draft recipient');
  record(new URL(mailUrl).searchParams.get('body').includes('A local test'),'Draft contains form details');
  console.log('Interactive controls, keyboard, content, and intercepted draft checked.');
  const routes=['/','/about/','/work/','/services/','/systems/','/contact/','/pricing/','/resume/',...portfolioData().projects.map(p=>'/work/'+p.slug+'/')];
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});
    for(const route of routes){
      await visit(route);await overflow(width+' '+route);
      record(await page.locator('h1:visible').count()===1,'Page H1 '+route);
      for(const url of await page.locator('a[href]').evaluateAll(els=>els.map(el=>el.href))){const u=new URL(url);if(u.origin===new URL(base).origin)links.add(u.pathname);}
      // AXE is scoped to representative templates; all routes get layout and console checks.
      if(['/','/contact/','/about/','/resume/','/pricing/','/work/serviceflow/'].includes(route)){
        const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
        for(const v of result.violations)failures.push('AXE '+width+' '+route+' '+v.id+' '+v.nodes.map(n=>n.target.join(' ')).join(', '));
      }
    }
    for(const view of views.slice(1)){
      await visit('/#'+view);
      const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      for(const v of result.violations)failures.push('AXE '+width+' '+view+' '+v.id+' '+v.nodes.map(n=>n.target.join(' ')).join(', '));
    }
    console.log('Routes and accessibility:',width);
  }
  await visit('/Portfolio/#projects');
  record((await page.locator('.project-preview-heading h3').innerText())==='Acerbox Builds','Subdirectory project route');
  record((await page.locator('.app-brand').getAttribute('href')).endsWith('/Portfolio/'),'Subdirectory shell links');
  record(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)==='auto','Reduced motion scroll');
  record(await page.locator('.workspace-boot').count()===0,'Reduced motion no intro');
  for(const route of links){const r=await page.request.get(base+route);record(r.status()===200,'Broken local link '+route);}
  record(errors.length===0,'Browser errors: '+errors.join('; '));
  writeFileSync('.preview/browser-qa.json',JSON.stringify({failures,errors,links:[...links]},null,2));
  assert.deepEqual(failures,[]);
  console.log('PASS: workspace and route QA; no browser errors; all collected local links respond.');
} finally { writeFileSync('.preview/browser-qa.json',JSON.stringify({failures,errors,links:[...links]},null,2)); await browser.close(); }


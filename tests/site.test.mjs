import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { root, portfolioData, resolvePublicPath } from '../scripts/project.mjs';

test('all existing projects retain screenshots, case routes, and required content', () => {
  const data = portfolioData();
  assert.equal(data.projects.length,9);
  for (const project of data.projects) {
    assert(existsSync(path.join(root,project.image)), project.slug + ' preview');
    assert(existsSync(path.join(root,'work',project.slug,'index.html')), project.slug + ' case study');
    assert(project.title && project.description && project.features.length && project.tech.length && project.value);
    if (project.url) assert.equal(new URL(project.url).protocol,'https:');
  }
  assert.equal(data.projects.find(p => p.slug === 'davis-pest-solutions').url,'https://davispestsol.co.nz/');
  assert.equal(data.projects.find(p => p.slug === 'acerbox-builds').url,'https://acerboxbuilds.com/');
  assert.equal(data.projects.filter(p => p.workflows).length,2);
});
test('local routes support both root preview and the GitHub Pages subdirectory', () => {
  assert.equal(resolvePublicPath('/'),path.join(root,'index.html'));
  assert.equal(resolvePublicPath('/Portfolio/'),path.join(root,'index.html'));
  assert.equal(resolvePublicPath('/Portfolio/work/serviceflow/'),path.join(root,'work/serviceflow/index.html'));
  assert.equal(resolvePublicPath('/assets/js/site.js?v=8'),path.join(root,'assets/js/site.js'));
});
test('preview server never exposes repository internals or paths outside public directories', () => {
  for (const unsafe of ['/.git/config','/scripts/build.mjs','/package.json','/img/../../package.json','/img/%2e%2e/%2e%2e/package.json','/assets%5c..%5cpackage.json','/img/%00','/%ZZ']) {
    assert.equal(resolvePublicPath(unsafe),null,unsafe);
  }
});
test('both client testimonials and the enquiry path are retained', () => {
  const home = readFileSync(path.join(root,'index.html'),'utf8');
  assert.match(home,/Margarita Grigoryan/);
  assert.match(home,/Francis is fast, talented/);
  assert.match(home,/Davis Pest Solutions/);
  assert.match(home,/mailto:rotoljay03@gmail.com/);
  const site = readFileSync(path.join(root,'assets/js/site.js'),'utf8');
  assert.match(site,/https:\/\/mail\.google\.com\/mail\//);
  assert.match(site,/form\.checkValidity\(\)/);
});

test('shared motion owns the cursor, including the printable resume screen', () => {
  const motion = readFileSync(path.join(root,'assets/js/motion.js'),'utf8');
  assert.match(motion,/document\.body\.append\(cursor\)/);
  assert.match(motion,/prefers-reduced-motion: reduce/);
  const resume = readFileSync(path.join(root,'resume.html'),'utf8');
  assert.match(resume,/assets\/js\/motion\.js/);
  const home = readFileSync(path.join(root,'index.html'),'utf8');
  assert.doesNotMatch(home,/class="custom-cursor"/);
});

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { root, walk, portfolioData } from './project.mjs';

const files = [...walk(path.join(root,'assets/js')), ...walk(path.join(root,'scripts')), ...walk(path.join(root,'tests'))];
let checked = 0;
for (const file of files.filter(file => /\.(?:js|mjs)$/.test(file))) {
  const result = spawnSync(process.execPath, ['--check',file], { encoding: 'utf8' });
  if (result.status !== 0) { console.error(result.error || result.stderr); process.exit(1); }
  if (readFileSync(file,'utf8').includes('console.log(') && file.includes(path.join('assets','js'))) {
    throw new Error('Remove browser debug logging from ' + file);
  }
  checked++;
}
const projects = portfolioData().projects;
if (new Set(projects.map(project => project.slug)).size !== projects.length) throw new Error('Duplicate project slug.');
console.log('Syntax checks passed for ' + checked + ' JavaScript files; project slugs are unique.');

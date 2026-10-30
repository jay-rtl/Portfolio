import { cpSync, existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { root, publicEntries, walk } from './project.mjs';
import {transform} from 'esbuild';

const destination = path.join(root,'dist');
if (path.dirname(destination) !== path.resolve(root)) throw new Error('Invalid build destination.');
if (existsSync(destination)) rmSync(destination, { recursive: true });
mkdirSync(destination);
publicEntries.forEach(entry => cpSync(path.join(root,entry), path.join(destination,entry), { recursive: true }));
for(const file of walk(path.join(destination,'assets')).filter(file=>/\.(?:css|js)$/.test(file)&&!file.includes(path.join('assets','vendor')))) {
  const result=await transform(readFileSync(file,'utf8'),{loader:file.endsWith('.css')?'css':'js',minify:true,legalComments:'inline',target:'es2022'});
  writeFileSync(file,result.code);
}
console.log('Static build ready in dist/. No upload or deployment was performed.');

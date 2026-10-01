import './style-bundle.mjs';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {root} from './project.mjs';
mkdirSync(path.join(root,'assets/vendor'),{recursive:true});
const source=readFileSync(path.join(root,'node_modules/gsap/dist/gsap.min.js'),'utf8');
writeFileSync(path.join(root,'assets/vendor/gsap.min.js'),source.replace(/[ \t]+$/gm,'').trimEnd()+'\n');
console.log('Copied pinned GSAP runtime with its license header.');

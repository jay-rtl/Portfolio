import './style-bundle.mjs';
import {copyFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {root} from './project.mjs';
mkdirSync(path.join(root,'assets/vendor'),{recursive:true});
copyFileSync(path.join(root,'node_modules/gsap/dist/gsap.min.js'),path.join(root,'assets/vendor/gsap.min.js'));
console.log('Copied pinned GSAP runtime with its license header.');

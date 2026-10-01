import {readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {root} from './project.mjs';
const sources=['site','workspace','motion','themes','refinement'];
const css=sources.map(name=>'/* '+name+'.css */\n'+readFileSync(path.join(root,'assets/css',name+'.css'),'utf8')).join('\n');
writeFileSync(path.join(root,'assets/css/workspace-bundle.css'),css);
console.log('Bundled five local stylesheets without changing their cascade.');

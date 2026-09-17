import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { root, publicEntries } from './project.mjs';

const destination = path.join(root,'dist');
if (path.dirname(destination) !== path.resolve(root)) throw new Error('Invalid build destination.');
if (existsSync(destination)) rmSync(destination, { recursive: true });
mkdirSync(destination);
publicEntries.forEach(entry => cpSync(path.join(root,entry), path.join(destination,entry), { recursive: true }));
console.log('Static build ready in dist/. No upload or deployment was performed.');

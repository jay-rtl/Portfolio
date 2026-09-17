import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const publicEntries = [
  'index.html', 'resume.html', 'robots.txt', 'sitemap.xml',
  'google0a9270b39237aabe.html', 'assets', 'img', 'about',
  'contact', 'pricing', 'resume', 'services', 'systems', 'work'
];
export function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const location = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(location) : [location];
  });
}
export function portfolioData() {
  const context = { window: {} };
  vm.runInNewContext(readFileSync(path.join(root,'assets/js/data.js'),'utf8'), context);
  return context.window.PORTFOLIO_DATA;
}
export function resolvePublicPath(urlPath, directory = root) {
  let decoded;
  try { decoded = decodeURIComponent(urlPath.split('?')[0]); } catch { return null; }
  if (decoded.includes('\0') || decoded.includes('\\')) return null;
  if (decoded === '/Portfolio') decoded = '/';
  else if (decoded.startsWith('/Portfolio/')) decoded = decoded.slice('/Portfolio'.length);
  if (decoded === '/') decoded = '/index.html';
  if (decoded.endsWith('/')) decoded += 'index.html';
  const segments = decoded.replace(/^\//,'').split('/');
  if (!publicEntries.includes(segments[0]) || segments.some(segment => segment === '..' || segment.startsWith('.'))) return null;
  const target = path.resolve(directory, ...segments);
  if (!target.startsWith(path.resolve(directory) + path.sep) || !existsSync(target)) return null;
  return target;
}

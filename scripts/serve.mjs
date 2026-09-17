import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import path from 'node:path';
import { resolvePublicPath } from './project.mjs';

const portIndex = process.argv.indexOf('--port');
const port = portIndex >= 0 ? Number(process.argv[portIndex + 1]) : 4321;
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Provide a valid --port.');
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8'
};
const server = createServer((request,response) => {
  if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405).end(); return; }
  const file = resolvePublicPath(request.url);
  if (!file || !statSync(file).isFile()) { response.writeHead(404).end('Not found'); return; }
  response.writeHead(200, {
    'Content-Type': types[path.extname(file)] || 'application/octet-stream',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  if (request.method === 'HEAD') response.end();
  else createReadStream(file).pipe(response);
});
server.listen(port, '127.0.0.1', () => console.log('Local preview ready: http://localhost:' + port + '/'));
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? 'Port ' + port + ' is occupied. Use npm run dev -- --port 4322.' : error);
  process.exitCode = 1;
});

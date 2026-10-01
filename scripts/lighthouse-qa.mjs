import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { chromium } from 'playwright';
import { createServer } from 'node:net';
import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('.preview',{recursive:true});
const port=await new Promise(resolve=>{const server=createServer();server.listen(0,'127.0.0.1',()=>{const port=server.address().port;server.close(()=>resolve(port));});});
const chrome=await chromium.launch({channel:'chrome',headless:true,args:['--remote-debugging-port='+port]});
try {
  for(const mode of (process.argv.includes('--desktop')?['desktop']:['mobile','desktop'])){
    const result=await lighthouse(process.env.PREVIEW_URL || 'http://localhost:4321/',{port,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']},mode==='desktop'?desktopConfig:undefined);
    writeFileSync('.preview/lighthouse-'+mode+'.json',result.report);
    const {categories,audits}=result.lhr;
    console.log(JSON.stringify({mode,scores:Object.fromEntries(Object.entries(categories).map(([id,c])=>[id,Math.round(c.score*100)])),LCP:audits['largest-contentful-paint'].displayValue,CLS:audits['cumulative-layout-shift'].displayValue,TBT:audits['total-blocking-time'].displayValue}));
  }
} finally { await chrome.close(); }

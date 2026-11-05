import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseRange} from './video-range.mjs';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.mp3':'audio/mpeg','.mp4':'video/mp4','.webm':'video/webm','.otf':'font/otf'};
if(!fs.existsSync(path.join(root,'index.html'))){console.error('No production build found. Run npm run build first.');process.exit(1);}
const server=http.createServer((req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);res.end();return;}
 const target=path.resolve(root,'.'+name+(name.endsWith('/')?'index.html':''));
 if(!target.startsWith(root)||name.split('/').some(v=>v.startsWith('.'))){res.writeHead(403);res.end();return;}
 fs.stat(target,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404);res.end('Not found');return;}
  const headers={'Content-Type':types[path.extname(target)]||'application/octet-stream','Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'};
  const range=req.headers.range?parseRange(req.headers.range,stat.size):null;
  if(range===false){res.writeHead(416,{...headers,'Content-Range':`bytes */${stat.size}`});res.end();return;}
  const start=range?.start||0,end=range?.end??stat.size-1;
  headers['Content-Length']=Math.max(0,end-start+1);if(range)headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
  res.writeHead(range?206:200,headers);if(req.method==='HEAD'){res.end();return;}
  const stream=fs.createReadStream(target,range?{start,end}:{});stream.on('error',()=>res.destroy());stream.pipe(res);
 });
});
const port=Number(process.env.PORT||4173);
server.listen(port,'0.0.0.0',()=>console.log(`Sunshine’s Kingdom: http://localhost:${port}\nKeep this window open. Press Ctrl+C to stop.`));
server.on('error',err=>{console.error(err.code==='EADDRINUSE'?`Port ${port} is busy. Close the other server or set PORT to a different value.`:err.message);process.exitCode=1;});

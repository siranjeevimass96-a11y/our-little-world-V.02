// The downloadable ZIP stores each MP4 once, in the ready-to-run dist folder.
// Restore source assets before Vite empties/rebuilds dist, or before development.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/cinematics/manifest.json'),'utf8'));
const clips=manifest.chapters.flatMap(c=>Object.values(c.phases).flat());
const sources=[...new Set(clips.flatMap(s=>[s.landscape,s.portrait]).filter(Boolean))];
let restored=0;
for(const src of sources){
 const target=path.join(root,'public',src), bundled=path.join(root,'dist',src);
 if(fs.existsSync(target))continue;
 if(!fs.existsSync(bundled))throw Error(`Missing bundled video: ${src}. Extract the complete ZIP before running this command.`);
 fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(bundled,target);restored++;
}
if(restored)console.log(`Restored ${restored} source videos from the included website build.`);

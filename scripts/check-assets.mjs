import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {KINGDOM,CHAPTERS} from '../src/story.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/cinematics/manifest.json'),'utf8'));
let missing=[];const check=p=>{if(!p)return;if(!fs.existsSync(path.join(root,'public',p.replace(/^\//,''))))missing.push(p)};
KINGDOM.photos.forEach(p=>check(p.src));CHAPTERS.forEach(c=>check('story-art/'+c.art));['quest-assets/royal-cast.png','quest-assets/characters.png',KINGDOM.music,'birthday-fonts/birthday-serif.otf','birthday-fonts/romantic-script.otf'].forEach(check);
let ready=0,planned=0;for(const chapter of manifest.chapters){check(chapter.gameplayPoster);for(const shot of Object.values(chapter.phases).flat()){check(shot.poster);check(shot.portraitPoster);if(shot.status==='ready'){ready++;if(!shot.landscape&&!shot.portrait)missing.push(`${shot.id}: ready needs a video source`);check(shot.landscape);check(shot.portrait);}else planned++;}}
if(missing.length){console.error('Missing assets:',missing);process.exitCode=1}else console.log(`Assets valid: ${KINGDOM.photos.length} photographs; 10 chapters; ${ready} ready shots, ${planned} PLANNED shots.`);

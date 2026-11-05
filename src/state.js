import {normalizeGarden} from './game-math.js';
export const SAVE_KEY='sunshine_movie_v3';
export const BACKUP_KEY=SAVE_KEY+'_backup';
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const int=(v,a,b,f=a)=>Number.isInteger(v)?clamp(v,a,b):f;
const ids=(v,max)=>Array.isArray(v)?[...new Set(v.filter(n=>Number.isInteger(n)&&n>=0&&n<max))]:[];
export const ordered=()=>Array.from({length:9},(_,i)=>i);
export const scramble=()=>[4,0,2,3,8,5,6,1,7];
export const initialState=()=>({version:3,chapter:0,furthest:0,started:false,checkpoint:null,completed:[],methods:{},fireflies:[],bridge:0,puzzle:scramble(),swaps:0,stars:0,lanterns:[],heart:{elapsed:0,score:0,streak:0,finished:false,best:0},growth:0,garden:normalizeGarden(null),weeds:[],gates:[],moon:30,heartRing:285,moonLocked:false,heartLocked:false,key:0,crowned:false,cakePresented:false,cakeCelebrated:false,wishMade:false,candlesOut:[],letter:false,wishes:[],favorite:41,keepsakeSaved:false,reduced:false});
export function normalize(x){
 const s=initialState(); if(!x||x.version!==3)return s;
 const order=Array.isArray(x.puzzle)&&x.puzzle.length===9&&new Set(x.puzzle).size===9&&x.puzzle.every(n=>Number.isInteger(n)&&n>=0&&n<9)?x.puzzle:s.puzzle;
 const chapter=int(x.chapter,0,9),heart=x.heart||{};
 const progress=chapter>0||ids(x.completed,10).length>0||ids(x.fireflies,5).length>0||x.bridge>0||x.swaps>0||x.stars>0||ids(x.lanterns,4).length>0||heart.elapsed>0||x.growth>0||ids(x.gates,3).length>0||x.crowned===true||x.letter===true;
 const checkpoint=x.checkpoint?.chapter===chapter&&['arrival','game','summary','surprise','cake','ending'].includes(x.checkpoint?.screen)?{chapter,screen:x.checkpoint.screen}:null;
 return {...s,chapter,checkpoint,furthest:Math.max(chapter,int(x.furthest,0,9)),started:x.started===true||progress,completed:ids(x.completed,10),methods:Object.fromEntries(Object.entries(x.methods||{}).filter(([k,v])=>/^[0-9]$/.test(k)&&['played','assisted','skipped'].includes(v))),fireflies:ids(x.fireflies,5),bridge:int(x.bridge,0,3),puzzle:order,swaps:int(x.swaps,0,100000),stars:int(x.stars,0,5),lanterns:ids(x.lanterns,4),heart:{elapsed:typeof heart.elapsed==='number'&&Number.isFinite(heart.elapsed)?clamp(heart.elapsed,0,60):0,score:int(heart.score,0,10000),streak:int(heart.streak,0,10000),best:int(heart.best,0,10000),finished:heart.finished===true},growth:int(x.growth,0,4),garden:normalizeGarden(x.garden,int(x.growth,0,4)),weeds:ids(x.weeds,3),gates:ids(x.gates,3),moon:int(x.moon,0,360,30),heartRing:int(x.heartRing,0,360,285),moonLocked:x.moonLocked===true,heartLocked:x.heartLocked===true,key:int(x.key,0,100),crowned:x.crowned===true,cakePresented:x.cakePresented===true,cakeCelebrated:x.cakeCelebrated===true,wishMade:x.wishMade===true,candlesOut:ids(x.candlesOut,5),letter:x.letter===true,wishes:ids(x.wishes,25),favorite:int(x.favorite,1,41,41),keepsakeSaved:x.keepsakeSaved===true,reduced:x.reduced===true};
}
let saveClock=0;
export function restore(storage){
 let latest=null,latestTime=-1;
 for(const key of [SAVE_KEY,BACKUP_KEY])try{const value=JSON.parse(storage.getItem(key));if(value?.version!==3)continue;const time=Number.isFinite(value._savedAt)?value._savedAt:0;if(time>latestTime){latest=value;latestTime=time;}}catch{}
 if(latest)saveClock=Math.max(saveClock,latestTime);
 return normalize(latest);
}
export function persist(storage,state){
 let value;try{saveClock=Math.max(Date.now(),saveClock+1);value=JSON.stringify({...state,_savedAt:saveClock})}catch{return false}
 let saved=false;
 for(const key of [SAVE_KEY,BACKUP_KEY])try{storage.setItem(key,value);saved=true;}catch{}
 return saved;
}
export function isComplete(s,c=s.chapter){return [s.fireflies.length===5,s.bridge===3,s.puzzle.every((v,i)=>v===i),s.stars===5,s.lanterns.length===4,s.heart.finished,s.growth===4&&s.weeds.length===3,s.gates.length===3&&s.moonLocked&&s.heartLocked&&s.key===100,s.crowned,s.letter][c];}
export const hasGift=(s,i)=>s.completed.includes([0,2,3][i]);
export function reward(s,method='played'){const c=s.chapter;return {...s,completed:[...new Set([...s.completed,c])],methods:{...s.methods,[c]:s.methods[c]||method}};}
export function finish(s,method='assisted'){
 const fields=[{fireflies:[0,1,2,3,4]},{bridge:3},{puzzle:ordered()},{stars:5},{lanterns:[0,1,2,3]},{heart:{...s.heart,finished:true}},{growth:4,weeds:[0,1,2]},{gates:[0,1,2],moon:270,heartRing:180,moonLocked:true,heartLocked:true,key:100},{crowned:true},{letter:true}];
 return reward({...s,...fields[s.chapter]},method);
}
export function assist(s){
 const c=s.chapter;if(isComplete(s,c))return s;
 let n={...s,methods:{...s.methods,[c]:'assisted'}};
 if(c===0)n.fireflies=[...s.fireflies,[0,1,2,3,4].find(v=>!s.fireflies.includes(v))];
 if(c===1)n.bridge++;
 if(c===2){const i=s.puzzle.findIndex((v,k)=>v!==k);n.puzzle=swap(s.puzzle,i,s.puzzle.indexOf(i));n.swaps++;}
 if(c===3)n.stars++;
 if(c===4)n.lanterns=[...s.lanterns,[0,1,2,3].find(v=>!s.lanterns.includes(v))];
 if(c===5)return finish(s,'assisted');
 if(c===6){if(s.growth<3)n.growth++;else{n.weeds=[...s.weeds,[0,1,2].find(v=>!s.weeds.includes(v))];if(n.weeds.length===3)n.growth=4;}}
 if(c===7){if(s.gates.length<3)n.gates=[...s.gates,[0,1,2].find(v=>!s.gates.includes(v))];else if(!s.moonLocked){n.moon=270;n.moonLocked=true;}else if(!s.heartLocked){n.heartRing=180;n.heartLocked=true;}else n.key=100;}
 if(c>=8)return finish(s,'assisted');return n;
}
export function swap(order,a,b){if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||a>8||b>8)return order;const n=[...order];[n[a],n[b]]=[n[b],n[a]];return n;}
export function scoreCatch(score,streak,kind){if(kind==='cloud')return {score:Math.max(0,score-2),streak:0,points:-Math.min(score,2)};const next=streak+1,points=(kind==='gold'?3:1)+(next%4===0?1:0);return {score:score+points,streak:next,points};}
export function advanceClock(elapsed,dt,paused=false){return paused?elapsed:Math.min(60,elapsed+Math.max(0,dt));}
export function moveChapter(s,c){if(!Number.isInteger(c)||c<0||c>9||c>s.furthest+1||c>s.furthest&&!s.completed.includes(s.chapter)&&!isComplete(s))return s;return {...s,chapter:c,furthest:Math.max(s.furthest,c)};}
export function resetGame(s,c=s.chapter){const fresh=initialState(),fields=[['fireflies'],['bridge'],['puzzle','swaps'],['stars'],['lanterns'],['heart'],['growth','garden','weeds'],['gates','moon','heartRing','moonLocked','heartLocked','key'],['crowned'],['letter']][c];const n={...s};fields.forEach(f=>n[f]=fresh[f]);if(c===5)n.heart.best=s.heart.best;return n;}

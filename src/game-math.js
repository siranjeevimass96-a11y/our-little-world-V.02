export const bound=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
export const point=(e,el=e.currentTarget)=>{const r=el.getBoundingClientRect();return {x:bound((e.clientX-r.left)/r.width*100),y:bound((e.clientY-r.top)/r.height*100)}};
export function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=bound(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)}
export const starPoints=[[12,66],[30,29],[50,58],[70,29],[88,66]];
export function traceStars(n,a,b){while(n<5&&segmentDistance({x:starPoints[n][0],y:starPoints[n][1]},a,b)<9)n++;return n}
export const circularDistance=(a,b)=>Math.abs(((a-b+540)%360)-180);
export function waterStep(water,aim,dt){const zone=aim<40?0:aim>60?2:1;return water.map((v,i)=>bound(v+(i===zone?Math.min(.15,Math.max(0,dt))*28:0)))}
export const safeFlameMove=(a,b)=>![[49,43],[59,72]].some(([x,y])=>segmentDistance({x,y},a,b)<10);
export function normalizeGarden(g,growth=0){const finite=(n,f=0)=>Number.isFinite(n)?bound(n):f;return {water:[0,1,2].map(i=>finite(g?.water?.[i],growth>=2?100:0)),sun:Number.isFinite(g?.sun)?bound(g.sun,-80,80):0,energy:finite(g?.energy,growth>=3?100:0)}}

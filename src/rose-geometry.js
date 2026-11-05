// Rounded, cupped petal surfaces, a curved stem and veined botanical leaves.
const TAU=Math.PI*2;
const clamp=n=>Math.max(0,Math.min(1,n));
function surface(out,point,color,rows=14,cols=10){
 const vertex=(u,v)=>{
  const p=point(u,v),a=point(u+.0001,v),b=point(u,v+.0001);
  const x=a.map((n,i)=>n-p[i]),y=b.map((n,i)=>n-p[i]);
  const normal=[x[1]*y[2]-x[2]*y[1],x[2]*y[0]-x[0]*y[2],x[0]*y[1]-x[1]*y[0]];
  let len=Math.hypot(...normal);
  if(len<1e-15){normal[0]=0;normal[1]=0;normal[2]=1;len=1;}
  return [...p,...normal.map(n=>n/len),...color(u,v)];
 };
 const grid=Array.from({length:rows+1},(_,i)=>Array.from({length:cols+1},(_,j)=>vertex(i/rows,j/cols)));
 for(let i=0;i<rows;i++)for(let j=0;j<cols;j++)for(const [a,b] of [[i,j],[i+1,j],[i+1,j+1],[i,j],[i+1,j+1],[i,j+1]])out.push(...grid[a][b]);
}
function ellipsoid(out,c,r,color){surface(out,(u,v)=>[c[0]+Math.cos(u*TAU)*Math.sin(v*Math.PI)*r[0],c[1]+Math.cos(v*Math.PI)*r[1],c[2]+Math.sin(u*TAU)*Math.sin(v*Math.PI)*r[2]],()=>color,20,12)}
function tube(out,curve,r,color,segments=8){surface(out,(u,v)=>{const p=curve(v);return[p[0]+Math.cos(u*TAU)*r,p[1],p[2]+Math.sin(u*TAU)*r]},()=>color,6,segments)}
function leaf(out,origin,angle,size){
 const co=Math.cos(angle),si=Math.sin(angle);
 const point=(u,v)=>{const w=(u*2-1)*Math.pow(Math.max(0,Math.sin(Math.PI*v)),.85)*.115*size,along=v*.43*size;return[origin[0]+co*along-si*w,origin[1]+v*.22*size+Math.sin(v*Math.PI)*.035+w*.75,origin[2]+si*along+co*w*.65]};
 surface(out,point,(u,v)=>{const light=.04*Math.sin(v*Math.PI)+.025*(1-Math.abs(u*2-1));return[.13+light,.34+light,.16+light]},12,8);
 tube(out,v=>{const p=point(.5,v);p[1]+=.004;return p},.004*size,[.36,.53,.25]);
 for(const t of [.32,.55,.75])for(const side of [0,1])tube(out,v=>{const p=point(.5+(side?1:-1)*v*.45,t+v*.14);p[1]+=.004;return p},.0018*size,[.29,.46,.22],3);
}
function blossom(out,y,size,bloom){
 const place=p=>[p[0]*size,y+(p[1]*.82-p[2]*.57)*size,(p[1]*.57+p[2]*.82)*size];
 for(let layer=4;layer>=0;layer--){
  const count=[4,5,7,8,9][layer],open=clamp(bloom*1.25-(4-layer)*.055);
  for(let i=0;i<count;i++){
   const angle=i*TAU/count+layer*2.399;
   surface(out,(u,v)=>{
    const across=u*2-1,t=v*(1-.24*across*across);
    const width=Math.pow(Math.max(0,Math.sin(t*Math.PI*.65)),.7);
    const theta=angle+across*(Math.PI/count*1.16+open*.04)*width;
    const r=.025+layer*.011+Math.sin(t*Math.PI*.5)*(.065+open*(.055+layer*.072))*(1-.10*across*across)+.035*open*Math.pow(t,6);
    const h=.015+(4-layer)*.019+t*(.255+layer*.012)-open*(.035+layer*.027)*t*t-.035*open*Math.pow(t,6)+.008*Math.sin(across*5+angle)*t*t;
    return place([Math.cos(theta)*r,h,Math.sin(theta)*r]);
   },(u,v)=>{const edge=Math.pow(v,4),shade=.84+.16*v;return[(.83+layer*.025)*shade+edge*.025,(.16+layer*.046)*shade+edge*.16,(.29+layer*.048)*shade+edge*.13]},14,10);
  }
 }
 // A shallow recessed center closes the flower without an upright central spike.
 ellipsoid(out,place([0,.12,0]),[.07*size,.025*size,.07*size],[.60,.13,.28]);
 ellipsoid(out,place([0,.02,0]),[.115*size,.055*size,.115*size],[.66,.17,.30]);
 for(let i=0;i<5;i++){const a=i*TAU/5;surface(out,(u,v)=>{const w=(u*2-1)*Math.sin(v*Math.PI)*.045,r=.025+v*.19;return place([Math.cos(a)*r-Math.sin(a)*w,-.018-v*.055,Math.sin(a)*r+Math.cos(a)*w])},()=>[.20,.39,.19],6,6)}
}
export function roseGeometry(growth,bloom){
 const out=[];growth=Math.max(0,Math.min(4,growth));bloom=clamp(bloom);
 ellipsoid(out,[0,-.9,0],[.58,.07,.33],[.22,.18,.115]);
 if(growth<.03){ellipsoid(out,[0,-.82,0],[.045,.065,.035],[.47,.29,.13]);return new Float32Array(out)}
 const h=.12+growth*.33,stem=v=>[.045*Math.sin(v*Math.PI*1.4),-.84+v*h,.025*Math.sin(v*Math.PI)];
 tube(out,stem,.018,[.20,.40,.18]);
 const leaves=clamp((growth-.35)/1.4);
 for(const[t,a,s]of[[.32,3.12,1],[.53,.15,.92],[.71,2.8,.58]])leaf(out,stem(t),a,leaves*s);
 const bud=clamp((growth-2.25)/.7);
 if(bud>0){const top=stem(1),offset=out.length;blossom(out,top[1],bud,bloom);for(let i=offset;i<out.length;i+=9){out[i]+=top[0];out[i+2]+=top[2]}}
 return new Float32Array(out);
}

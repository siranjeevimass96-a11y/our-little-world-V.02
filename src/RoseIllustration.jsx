import React,{useId} from 'react';
// A botanical fallback for devices without WebGL, following the same growth state.
export default function RoseIllustration({growth,bloom=0}){
 const id=useId().replace(/:/g,''),url=name=>`url(#${id}-${name})`;
 const height=22+growth*43,top=316-height,leaves=Math.min(1,Math.max(0,(growth-.35)/1.4)),bud=Math.min(1,Math.max(0,(growth-2.25)/.7)),opened=Math.max(0,Math.min(1,bloom));
 return <svg className="illustrated-rose" viewBox="0 0 400 390" role="img" aria-label={opened>.95?'A pink rose with layered petals and veined green leaves, in full bloom':'A rose growing from seed to bud'}>
 <defs>
 <radialGradient id={`${id}-earth`}><stop stopColor="#665239"/><stop offset="1" stopColor="#27392b"/></radialGradient>
 <linearGradient id={`${id}-leaf`} x2=".8" y2="1"><stop stopColor="#73964d"/><stop offset=".48" stopColor="#487844"/><stop offset="1" stopColor="#1d4a30"/></linearGradient>
 <linearGradient id={`${id}-petal`} x1=".1" y1="0" x2=".65" y2="1"><stop stopColor="#ffd1d6"/><stop offset=".4" stopColor="#ef91a4"/><stop offset=".78" stopColor="#cf5277"/><stop offset="1" stopColor="#8d294a"/></linearGradient>
 <linearGradient id={`${id}-inner`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f9aabc"/><stop offset=".5" stopColor="#d56486"/><stop offset="1" stopColor="#902a50"/></linearGradient>
 </defs>
 <ellipse cx="200" cy="326" rx="80" ry="15" fill={url('earth')}/>
 {growth===0?<ellipse cx="200" cy="315" rx="5" ry="8" fill="#b48b52"/>:<>
 <path className="rose-stem" d={`M200 322 C214 ${316-height*.35} 182 ${316-height*.7} 200 ${top}`} fill="none" stroke="#477a42" strokeWidth="4.5" strokeLinecap="round"/>
 <path d={`M200 322 C213 ${316-height*.35} 183 ${316-height*.7} 200 ${top}`} fill="none" stroke="#96ad69" strokeWidth="1" opacity=".6"/>
 {[[-1,.32,1],[1,.55,.92],[-1,.73,.58]].map(([side,t,size],i)=><g key={i} transform={`translate(200 ${316-height*t}) scale(${side*leaves*size} ${leaves*size})`}>
 <path d="M0 0C19-8 29-34 67-39L63-32 66-30 58-25 60-22 50-17 51-14 40-10 40-7 27-4C16 1 7 2 0 0Z" fill={url('leaf')}/>
 <path d="M0 0Q32-17 65-37M18-9L20-20M30-16L33-29M42-23L48-34M20-10L31-7M34-18L44-14M47-26L55-23" fill="none" stroke="#acc486" strokeWidth=".7" opacity=".55"/>
 </g>)}
 <g transform={`translate(200 ${top}) scale(${bud})`}>
 <path d="M0 12Q-25 3-28-16L-6-4 0-23 7-5 27-17Q22 7 0 12" fill="#477c41"/>
 <g opacity={1-opened}><path d="M0 6C-26-1-23-33-12-42C-1-49 18-39 21-25C25-7 13 4 0 6Z" fill={url('petal')}/><path d="M0 6C15-12-12-23-12-42M0 6C-13-12 16-20 16-34" fill="none" stroke="#a03c5d" strokeWidth="1.2"/></g>
 <g opacity={opened} transform={`translate(0 -16) scale(${.45+opened*.55} ${.4+opened*.48})`}>
 {[{n:8,s:1,r:16},{n:7,s:.77,r:43},{n:5,s:.55,r:9},{n:4,s:.34,r:42}].map(({n,s,r},layer)=><g key={layer}>{Array.from({length:n},(_,i)=><g key={i} transform={`rotate(${i*360/n+r}) scale(${s})`}><path d="M-13 15C-29 2-48-15-44-36C-40-55-24-64-5-57C10-66 35-53 40-36C47-15 24 6 8 17C1 19-7 18-13 15Z" fill={url(layer<2?'petal':'inner')} stroke="#e99aaa" strokeWidth=".65"/><path d="M-42-35C-37-51-24-59-7-53C7-61 28-52 35-39" fill="none" stroke="#ffd7dd" strokeWidth="1.2" opacity=".6"/></g>)}</g>)}
 <path d="M-7 7C-22-4-12-21 3-17C18-14 15 3 4 6C-8 11-13-4-4-7C4-11 10-2 3 1" fill="#a2355b" stroke="#f2a3b6" strokeWidth="2.2"/>
 </g></g></>}
 </svg>
}

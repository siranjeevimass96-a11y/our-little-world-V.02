import React,{useEffect,useRef,useState} from 'react';
export const asset=p=>`${import.meta.env.BASE_URL}${p.replace(/^\//,'')}`;
const cells={hero:[0,0,400,558],seated:[405,35,455,525],rose:[804,0,355,560],swan:[1160,0,376,555],unicorn:[0,552,398,472],troll:[408,558,447,466],rabbit:[858,555,300,469],owl:[1170,550,366,474]};
const old={wizard:[0,0,627,665],fairy:[627,0,627,665],dragon:[0,668,627,586],fox:[627,668,627,586]};
export function Sprite({who,className=''}){const legacy=!!old[who];return <svg className={`sprite ${className}`} viewBox={(old[who]||cells[who]).join(' ')} aria-hidden="true"><image href={asset(legacy?'quest-assets/characters.png':'quest-assets/royal-cast.png')} width={legacy?1254:1536} height={legacy?1254:1024}/></svg>}
export function useManifest(){const [data,setData]=useState(null),[error,setError]=useState('');useEffect(()=>{let active=true;fetch(asset('cinematics/manifest.json')).then(r=>{if(!r.ok)throw Error('Manifest could not load');return r.json()}).then(d=>{if(!Array.isArray(d.chapters)||d.chapters.length!==10)throw Error('Invalid cinematic manifest');if(active)setData(d)}).catch(e=>{if(active)setError(e.message)});return()=>{active=false}},[]);return {data,error};}
export {default as Cinematic} from './Cinematic.jsx';
export function ScenePoster({entry,chapter}){return <><img className="scene-art" src={asset(entry?.gameplayPoster||`story-art/${chapter.art}`)} alt=""/><div className="scene-shade"/><span className="scene-label">Your next little adventure</span></>}

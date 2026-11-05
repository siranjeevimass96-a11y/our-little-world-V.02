import React,{useEffect,useRef,useState} from 'react';
import {asset} from './media.jsx';
import {useVisible} from './GameUI.jsx';
import {dissolveProgress,shouldDissolve} from './cinematic-timing.js';
const source=c=>c?.status==='ready'?(c.landscape||c.portrait):null;
const keyOf=c=>source(c)||c?.id||'preview';

export default function Cinematic({clips=[],continuation,poster,title,reduced,muted,active=true,captions=true,onDone}){
 const [currentKey,setCurrentKey]=useState(null),[paused,setPaused]=useState(!!reduced),[failed,setFailed]=useState({}),[time,setTime]=useState(0),[original,setOriginal]=useState(false),[blend,setBlend]=useState(0),[crossing,setCrossing]=useState(false);
 const videos=useRef({}),fade=useRef(null),finished=useRef(false),generation=useRef(0),latest=useRef(),visible=useVisible();
 const index=Math.max(0,clips.findIndex(c=>keyOf(c)===currentKey)),clip=clips[index],key=keyOf(clip);
 const nextClip=clips[index+1]||continuation?.clips?.[0],nextKey=nextClip?keyOf(nextClip):null,boundary=!clips[index+1]&&!!nextClip;
 const enabled=active&&visible&&!paused;
 const rate=c=>original?1:/dialogue|D\d\d/i.test(c?.id+' '+source(c))?.95:.85;
 const finish=()=>{if(finished.current)return;finished.current=true;onDone()};
 const advance=()=>{
  if(fade.current||finished.current)return;
  if(!nextClip){finish();return;}
  const v=videos.current[nextKey],token=generation.current;
  const pending={from:key,to:nextKey,boundary,progress:0,playing:false,mediaTime:v?.currentTime||0};
  fade.current=pending;setCrossing(true);
  const start=()=>{if(token!==generation.current||fade.current!==pending)return;pending.playing=true;};
  if(v&&!failed[nextKey]){
   v.volume=0;v.muted=muted;v.playbackRate=rate(nextClip);v.preservesPitch=true;
   v.play().then(start).catch(()=>{if(token!==generation.current||fade.current!==pending)return;fade.current=null;setCrossing(false);setPaused(true)});
  }else start();
 };
 latest.current={enabled,key,nextKey,clip,nextClip,boundary,reduced,muted,rate,advance,finish,onDone,failed};
 useEffect(()=>{finished.current=false;setTime(videos.current[key]?.currentTime||0);if(fade.current&&fade.current.from!==key){generation.current++;fade.current=null;setBlend(0);setCrossing(false)}},[key]);
 useEffect(()=>{
  Object.entries(videos.current).forEach(([k,v])=>{
   const f=fade.current,isCurrent=k===key,isIncoming=f?.to===k;
   v.muted=muted;v.playbackRate=rate(isCurrent?clip:nextClip);v.preservesPitch=true;
   v.volume=isCurrent?1-(f?.progress||0):isIncoming?(f?.progress||0):0;
   if(!enabled||(!isCurrent&&!isIncoming))v.pause();
   else if(!v.ended)v.play().catch(()=>setPaused(true));
  });
 },[enabled,key,nextKey,muted,original,crossing]);
 useEffect(()=>{
  let raf,last=0;
  const tick=now=>{
   const dt=last?Math.min((now-last)/1000,.1):0;last=now;
   const s=latest.current,v=videos.current[s.key],f=fade.current;
   if(s.enabled){
    if(f?.playing){
     const incoming=videos.current[f.to];
     if(!incoming||s.failed[f.to]||((!incoming.paused||incoming.ended)&&incoming.readyState>=2)){
      const elapsed=incoming&&!s.failed[f.to]?Math.max(0,incoming.currentTime-f.mediaTime)/incoming.playbackRate:dt;
      if(incoming)f.mediaTime=incoming.currentTime;
      f.progress=dissolveProgress(f.progress,elapsed,s.reduced);setBlend(f.progress);
      if(v)v.volume=1-f.progress;if(incoming)incoming.volume=f.progress;
      if(f.progress>=1){
       fade.current=null;setCrossing(false);setBlend(0);setCurrentKey(f.to);
       // The incoming element keeps its stable key across a chapter/phase change.
       if(f.boundary)s.onDone({continued:true});
      }
     }
    }else if(!f&&s.nextClip&&v&&shouldDissolve(v.duration,v.currentTime,v.playbackRate))s.advance();
   }
   raf=requestAnimationFrame(tick);
  };
  raf=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(raf);generation.current++;fade.current=null;};
 },[]);
 useEffect(()=>{if(reduced)setPaused(true)},[reduced]);
 const replay=()=>{generation.current++;fade.current=null;finished.current=false;setBlend(0);setCrossing(false);setCurrentKey(keyOf(clips[0]));setPaused(false);Object.values(videos.current).forEach(v=>{v.pause();v.currentTime=0});const v=videos.current[keyOf(clips[0])];if(v){v.volume=1;v.play().catch(()=>setPaused(true))}};
 const toggle=()=>setPaused(v=>!v);
 const ease=blend*blend*(3-2*blend);
 return <section className={`film immersive-film ${crossing?'is-dissolving':''}`} aria-label={`${title} cinematic`}>
  <div className="film-image">
   {[clip,nextClip].filter((c,i)=>c||i===0).map((c,i)=>{const k=keyOf(c),src=source(c);return <div key={k} className={`film-layer ${i===0?'current':'incoming'}`} style={{opacity:i===0?1:ease}} aria-hidden={i!==0}>
    {src&&!failed[k]?<video ref={v=>{if(v)videos.current[k]=v;else delete videos.current[k]}} src={asset(src)} poster={asset(c?.poster||poster)} preload="auto" playsInline muted={muted}
     onCanPlay={()=>{const s=latest.current;if(k===s.key&&s.enabled&&!videos.current[k]?.ended)videos.current[k]?.play().catch(()=>setPaused(true))}}
     onTimeUpdate={()=>{const s=latest.current,v=videos.current[k];if(k===s.key&&v){setTime(v.currentTime);if(s.enabled&&s.nextClip&&shouldDissolve(v.duration,v.currentTime,v.playbackRate))s.advance()}}}
     onEnded={()=>{if(k===latest.current.key&&!fade.current)latest.current.advance()}}
     onError={()=>setFailed(f=>({...f,[k]:true}))}/>:<img src={asset(c?.poster||poster)} alt={i===0?(c?.caption||title):''}/>}
   </div>})}
   <div className="film-vignette"/>
   <span className="film-tag">{failed[key]||!source(clip)?'Scene preview':'A little movie'} · {index+1}/{clips.length||1}</span>
   {paused&&<button className="film-play" onClick={toggle}>▶ Continue scene</button>}
   <span className="film-star" aria-hidden="true">✦</span>
  </div>
  {captions&&<div className="story-caption" key={key}><span className="eyebrow">{title}</span><p>{clip?.caption||clip?.label||'Your next little adventure is waiting.'}</p></div>}
  <div className="film-controls"><button onClick={toggle}>{paused?'▶ Play':'Ⅱ Pause'}</button><button onClick={replay}>↺ Replay</button><button aria-pressed={!original} onClick={()=>setOriginal(v=>!v)}>{original?'Original pace':'Gentle pace'}</button><span>{Math.floor(time)} / {Math.round(clip?.seconds||0)}s</span><button disabled={crossing} onClick={()=>{setPaused(false);advance()}}>{nextClip?'Next scene →':'Step into the story →'}</button><button onClick={finish}>Skip cinematic →</button></div>
 </section>
}

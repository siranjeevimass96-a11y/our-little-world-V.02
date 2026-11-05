import {createMelodyAudio} from './melody-audio.js';
import React,{useEffect,useRef,useState} from 'react';import {point} from './game-math.js';import {Dust,Feedback,useVisible} from './GameUI.jsx';
export function Fireflies({s,patch,active}){const[selected,setSelected]=useState(null),[position,setPosition]=useState(null),[message,setMessage]=useState('Guide each little light home. Drag it to the lantern.');const board=useRef(),drag=useRef(null);const collect=i=>{if(i===null||!active)return;patch(v=>({fireflies:[...new Set([...v.fireflies,i])]}));setSelected(null);setPosition(null);setMessage(['A little courage, tucked safely away.','A little wonder, to light the path.','A little kindness, glowing brighter.','A little hope, carried with you.','Five little lights. The forest is awake.'][s.fireflies.length])};return <><div ref={board} className="game-board forest-game"><Dust/><div className="forest-moon"/><div className="forest-path"/>{[[16,27],[78,20],[47,43],[82,66],[18,65]].map(([x,y],i)=>!s.fireflies.includes(i)&&<button key={i} className={`wandering-light ${selected===i?'selected':''}`} style={{left:`${position?.i===i?position.x:x}%`,top:`${position?.i===i?position.y:y}%`,'--delay':`${-i*1.3}s`}} aria-label={`Guide firefly ${i+1}`} aria-pressed={selected===i} onPointerDown={e=>{drag.current=i;e.currentTarget.setPointerCapture(e.pointerId);setSelected(i)}} onPointerMove={e=>{if(drag.current===i)setPosition({i,...point(e,board.current)})}} onPointerUp={e=>{const p=point(e,board.current);if(Math.hypot(p.x-50,p.y-81)<20)collect(i);drag.current=null;setPosition(null)}} onPointerCancel={()=>{drag.current=null;setPosition(null)}} onClick={()=>setSelected(i)}>✦</button>)}<button className={`home-lantern ${s.fireflies.length===5?'full':''}`} onClick={()=>collect(selected)} aria-label="Place selected firefly in the lantern"><span style={{opacity:.2+s.fireflies.length*.16}}>✧</span><small>{s.fireflies.length}/5 lights</small></button></div><Feedback>{message}</Feedback><small>You can also select a firefly, then select the lantern.</small></>}
export function Bridge({s,patch,active}) {
 const [flash,setFlash]=useState(-1),[watching,setWatching]=useState(false),[step,setStep]=useState(0),[attempt,setAttempt]=useState(0),[started,setStarted]=useState(false),[muted,setMuted]=useState(false),[starting,setStarting]=useState(false),[message,setMessage]=useState('Press Play the melody to hear the stones, then repeat their pattern.');
 const visible=useVisible(),audio=useRef(null),soundOff=useRef(false),mounted=useRef(true),busy=useRef(false),inputStep=useRef(0);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;audio.current?.dispose();audio.current=null}},[]);
 useEffect(()=>{
  if(!active||!visible||s.bridge===3||!started){audio.current?.stop();return;}
  inputStep.current=0;setWatching(true);setStep(0);setFlash(-1);setMessage('Listen and watch. Each stone has its own note.');
  const timers=[];
  for(let i=0;i<=s.bridge;i++){
   timers.push(setTimeout(()=>{setFlash(i);if(!soundOff.current)audio.current?.play(i)},400+i*1000));
   timers.push(setTimeout(()=>setFlash(-1),1150+i*1000));
  }
  timers.push(setTimeout(()=>{setWatching(false);setMessage('Your turn. Repeat the glowing melody.')},1400+s.bridge*1000));
  return()=>{timers.forEach(clearTimeout);audio.current?.stop()};
 },[s.bridge,attempt,active,visible,started]);
 const play=async()=>{
  if(busy.current||watching||!active||s.bridge===3)return;
  busy.current=true;setStarting(true);
  audio.current ||= createMelodyAudio();
  const audible=await audio.current.unlock();
  busy.current=false;if(!mounted.current)return;setStarting(false);
  if(!audible){setMessage('Sound could not start. Try Play the melody again, or choose Watch without sound.');return;}
  soundOff.current=false;setMuted(false);setWatching(true);setStarted(true);setAttempt(n=>n+1);
 };
 const choose=n=>{
  if(watching||!started||!active||s.bridge===3)return;
  if(!soundOff.current)audio.current?.play(n);
  if(n!==inputStep.current){setWatching(true);setMessage('Almost. Wisp will play it once more.');setAttempt(a=>a+1);return;}
  const next=inputStep.current+1;inputStep.current=next;setStep(next);setFlash(n);
  if(next===s.bridge+1){setWatching(true);patch({bridge:s.bridge+1});setMessage(s.bridge===2?'The river welcomes you across.':'A new stone joins the melody.')}
 };
 return <><div className="game-board memory-bridge"><Dust/><div className="river-flow"/><span className="eyebrow">THE RIVER REMEMBERS</span><h3>{s.bridge===3?'A path made of light':watching?'Listen & remember':'Echo the melody'}</h3><div className="sequence-dots" aria-label={`Round ${Math.min(s.bridge+1,3)} of 3`}>{[0,1,2].map(i=><i className={i<s.bridge?'complete':i===s.bridge?'current':''} key={i}/>)}</div><div className="stones">{[2,0,1].map(n=><button key={n} disabled={watching||!started||s.bridge===3} className={flash===n?'lit singing':''} aria-label={['Leaf stone','Moon stone','Star stone'][n]} onClick={()=>choose(n)}>{['❧','☾','✧'][n]}<small>{['Leaf','Moon','Star'][n]}</small></button>)}</div><div className="board-foot">Round {Math.min(s.bridge+1,3)} of 3 · {watching?'Listen and watch the stones':`${step} / ${Math.min(s.bridge+1,3)} remembered`}</div></div><Feedback>{message}</Feedback><div className="button-row"><button className="primary" disabled={starting||watching||s.bridge===3} onClick={play}>{starting?'Preparing the melody…':started?'↺ Play the melody again':'♫ Play the melody'}</button><button disabled={s.bridge===3} aria-pressed={muted} onClick={()=>{soundOff.current=!soundOff.current;setMuted(soundOff.current);if(soundOff.current)audio.current?.stop()}}>{muted?'Melody sound off':'Melody sound on'}</button></div>{!started&&<button className="text-button" onClick={()=>{soundOff.current=true;setMuted(true);setStarted(true);setWatching(true)}}>Watch without sound</button>}<small>Melody notes play separately from the background music.</small></>;
}

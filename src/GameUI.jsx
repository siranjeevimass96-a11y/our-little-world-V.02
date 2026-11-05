import React,{useEffect,useState} from 'react';
export function useVisible(){const[v,set]=useState(true);useEffect(()=>{const fn=()=>set(!document.hidden);fn();document.addEventListener('visibilitychange',fn);return()=>document.removeEventListener('visibilitychange',fn)},[]);return v}
export function Dust(){return <div className="magic-dust" aria-hidden="true">{Array.from({length:14},(_,i)=><i key={i} style={{left:`${(i*37+7)%100}%`,top:`${(i*29+9)%90}%`,'--delay':`${-i*.61}s`}}/>)}</div>}
export function Meter({value,label}){return <div className="care-meter"><span>{label}</span><div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)}><i style={{width:`${value}%`}}/></div></div>}
export function Feedback({children}){return <p className="gentle-feedback" role="status">{children}</p>}

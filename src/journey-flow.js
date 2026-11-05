import {normalize,isComplete,reward} from './state.js';
export const isFilmMode = mode => ['arrival','reward','departure','surprise','celebration'].includes(mode) || mode.startsWith('replay-');
export function resumeMode(s, complete) {
  if (!s.started) return 'welcome';
  if (s.chapter === 8 && s.crowned && !s.cakeCelebrated) return s.cakePresented ? 'cake' : 'surprise';
  const screen=s.checkpoint?.chapter===s.chapter?s.checkpoint.screen:null;
  if(screen==='ending'&&s.chapter===9&&s.letter)return 'ending';
  if(screen==='game'&&!complete)return 'game';
  if(complete||s.completed.includes(s.chapter))return 'summary';
  return screen==='arrival'?'arrival':'game';
}
export function afterFilm(mode, chapter, complete, replayReturn = 'summary') {
  if (mode.startsWith('replay-')) return replayReturn;
  if (mode === 'arrival') return complete ? 'summary' : 'game';
  if (mode === 'reward') return chapter === 8 ? 'surprise' : 'summary';
  if (mode === 'surprise') return 'cake';
  if (mode === 'celebration') return 'summary';
  return chapter === 9 ? 'ending' : 'arrival';
}

// Persist a usable story screen, never a temporary overlay or replay.
export function checkpointState(state,mode,replayReturn='summary'){
 let s=normalize(state);
 // A game is earned as soon as its last action completes, even if the tab
 // closes before the short celebration/reward-film timer finishes.
 for(let chapter=0;chapter<10;chapter++)if(isComplete(s,chapter)&&!s.completed.includes(chapter)){
  const current=s.chapter;s=reward({...s,chapter});s.chapter=current;
 }
 if(!s.started)return {...s,checkpoint:null};
 let screen=mode.startsWith('replay-')?replayReturn:mode;
 if(['reward','departure','celebration'].includes(screen)||screen==='game'&&isComplete(s))screen='summary';
 if(s.chapter===8&&s.crowned&&!s.cakeCelebrated)screen=s.cakePresented?'cake':'surprise';
 if(!['arrival','game','summary','surprise','cake','ending'].includes(screen))screen=resumeMode({...s,checkpoint:null},isComplete(s));
 return {...s,checkpoint:{chapter:s.chapter,screen}};
}

// Wishes are optional; story progress alone chooses the next palace scene.
export function palaceNextMode(s){
 if(!s.crowned)return 'reward';
 if(!s.cakeCelebrated)return s.cakePresented?'cake':'surprise';
 return 'departure';
}

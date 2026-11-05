import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,normalize} from '../src/state.js';
import {resumeMode,afterFilm,isFilmMode} from '../src/journey-flow.js';

test('coronation leads through surprise and a user-controlled wish before celebration',()=>{
 assert.equal(afterFilm('reward',8,true),'surprise');
 assert.equal(afterFilm('surprise',8,true),'cake');
 assert.equal(isFilmMode('cake'),false);
 assert.equal(afterFilm('celebration',8,true),'summary');
 assert.equal(afterFilm('reward',7,true),'summary');
});
test('replay returns to its caller instead of restarting the cake interaction',()=>{
 for(const phase of ['reward','surprise','celebration'])assert.equal(afterFilm('replay-'+phase,8,true,'summary'),'summary');
});
test('resume and old saves cannot silently bypass the new birthday surprise',()=>{
 const old={...initialState(),started:true,chapter:8,crowned:true};
 assert.equal(resumeMode(old,true),'surprise');
 assert.equal(resumeMode({...old,cakePresented:true},true),'cake');
 assert.equal(resumeMode({...old,cakeCelebrated:true},true),'summary');
 assert.equal(resumeMode(initialState(),false),'welcome');
});
test('a partially completed wish survives reload and invalid candle ids are removed',()=>{
 const s={...initialState(),wishMade:true,cakePresented:true,candlesOut:[0,2,4]};
 assert.deepEqual(normalize(s),s);
 assert.deepEqual(normalize({...s,candlesOut:[0,0,9,-1,'2']}).candlesOut,[0]);
});

test('palace continuation never depends on wishes read',async()=>{
 const {palaceNextMode}=await import('../src/journey-flow.js');
 for(const wishes of [[],[0,12],Array.from({length:25},(_,i)=>i)]){
  const s={...initialState(),chapter:8,wishes};
  assert.equal(palaceNextMode(s),'reward');
  assert.equal(palaceNextMode({...s,crowned:true}),'surprise');
  assert.equal(palaceNextMode({...s,crowned:true,cakePresented:true}),'cake');
  assert.equal(palaceNextMode({...s,crowned:true,cakeCelebrated:true}),'departure');
 }
});

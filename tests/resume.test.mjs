import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,normalize,restore,persist,SAVE_KEY,BACKUP_KEY,moveChapter,isComplete} from '../src/state.js';
import {checkpointState,resumeMode} from '../src/journey-flow.js';
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)}};
test('closing immediately after the last game action restores the completed section and unlocks next chapter',()=>{
 const storage=memory();const state={...initialState(),started:true,fireflies:[0,1,2,3,4]};
 persist(storage,checkpointState(state,'game'));
 const restored=restore(storage);
 assert.equal(resumeMode(restored,isComplete(restored)),'summary');
 assert.deepEqual(restored.completed,[0]);assert.equal(moveChapter(restored,1).chapter,1);
});
test('a partial game resumes in its current chapter and preserves every earned section',()=>{
 const storage=memory();const state={...initialState(),started:true,chapter:3,furthest:3,completed:[0,1,2],stars:2};
 persist(storage,checkpointState(state,'game'));
 const restored=restore(storage);assert.equal(restored.chapter,3);assert.equal(restored.stars,2);
 assert.deepEqual(restored.completed,[0,1,2]);assert.equal(resumeMode(restored,false),'game');
});
test('the completed ending reopens on the ending, while a film replay does not replace the story checkpoint',()=>{
 const state={...initialState(),started:true,chapter:9,furthest:9,letter:true};
 let saved=checkpointState(state,'ending');assert.equal(resumeMode(saved,true),'ending');
 saved=checkpointState(state,'replay-departure','summary');assert.equal(resumeMode(saved,true),'summary');
});
test('corrupt primary storage recovers the backup; deliberate restart clears both copies',()=>{
 const storage=memory();persist(storage,checkpointState({...initialState(),started:true,fireflies:[1,3]},'game'));
 storage.setItem(SAVE_KEY,'{broken');assert.deepEqual(restore(storage).fireflies,[1,3]);
 persist(storage,initialState());assert.deepEqual(restore(storage),initialState());
 assert.deepEqual(normalize(JSON.parse(storage.getItem(BACKUP_KEY))),initialState());
});
test('legacy progress without a started flag does not open a fresh invitation',()=>{
 const storage=memory();storage.setItem(SAVE_KEY,JSON.stringify({...initialState(),chapter:4,furthest:4,completed:[0,1,2,3]}));
 const restored=restore(storage);assert.equal(restored.started,true);assert.equal(resumeMode(restored,false),'game');
});
test('checkpoint validation rejects mismatched chapters and arbitrary screens',()=>{
 const storage=memory();const s={...initialState(),started:true,chapter:2,checkpoint:{chapter:9,screen:'ending'}};
 storage.setItem(SAVE_KEY,JSON.stringify(s));assert.equal(restore(storage).checkpoint,null);
 s.checkpoint={chapter:2,screen:'injected'};storage.setItem(SAVE_KEY,JSON.stringify(s));assert.equal(restore(storage).checkpoint,null);
});

test('the newest successful copy wins when one storage key cannot be written',()=>{
 const storage=memory();persist(storage,initialState());
 const blockedPrimary={getItem:storage.getItem,setItem:(k,v)=>{if(k===SAVE_KEY)throw Error('blocked');storage.setItem(k,v)}};
 assert.equal(persist(blockedPrimary,checkpointState({...initialState(),started:true,fireflies:[0]},'game')),true);
 assert.deepEqual(restore(storage).fireflies,[0]);
 const blockedBackup={getItem:storage.getItem,setItem:(k,v)=>{if(k===BACKUP_KEY)throw Error('blocked');storage.setItem(k,v)}};
 persist(blockedBackup,checkpointState({...initialState(),started:true,fireflies:[0,1]},'game'));
 assert.deepEqual(restore(storage).fireflies,[0,1]);
});

test('the next chapter is reachable immediately after earning completion',()=>{
 const state={...initialState(),started:true,fireflies:[0,1,2,3,4]};
 assert.equal(moveChapter(state,1).chapter,1);
 assert.equal(moveChapter({...initialState(),started:true},1).chapter,0);
});

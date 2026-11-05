import test from 'node:test';
import assert from 'node:assert/strict';
import {shouldDissolve,dissolveProgress} from '../src/cinematic-timing.js';
test('dissolve starts before the outgoing film ends at either playback pace',()=>{
 assert.equal(shouldDissolve(10,8.8,1),false);
 assert.equal(shouldDissolve(10,8.91,1),true);
 assert.equal(shouldDissolve(10,9,.85),false);
 assert.equal(shouldDissolve(10,9.07,.85),true);
 assert.equal(shouldDissolve(NaN,0),false);
 assert.equal(shouldDissolve(Infinity,10),false);
});
test('dissolve freezes without playback time and supports reduced motion',()=>{
 assert.equal(dissolveProgress(.4,0),.4);
 assert.ok(Math.abs(dissolveProgress(0,.55)-.5)<1e-9);
 assert.equal(dissolveProgress(.9,1),1);
 assert.equal(dissolveProgress(0,0,true),1);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {createMelodyAudio} from '../src/melody-audio.js';

test('blocked or unavailable audio can be retried without breaking the game',async()=>{
 assert.equal(await createMelodyAudio({}).unlock(),false);
 let blocked=true;
 class Context {constructor(){this.state='suspended'}async resume(){if(blocked)throw Error('gesture required');this.state='running'}async close(){this.state='closed'}}
 const instrument=createMelodyAudio({AudioContext:Context});
 assert.equal(instrument.play(0),false);
 assert.equal(await instrument.unlock(),false);
 blocked=false;assert.equal(await instrument.unlock(),true);
 assert.equal(instrument.play(99),false);
 instrument.dispose();assert.equal(instrument.play(0),false);
});

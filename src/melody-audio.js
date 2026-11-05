// A small, self-contained bell instrument. Unlock only from a user gesture.
export const MELODY_NOTES = [523.25, 659.25, 783.99];
export function createMelodyAudio(host = globalThis) {
  let context = null;
  const voices = new Set();
  return {
    async unlock() {
      try {
        const AudioContext = host.AudioContext || host.webkitAudioContext;
        if (!AudioContext) return false;
        if (!context || context.state === 'closed') context = new AudioContext();
        if (context.state !== 'running') await context.resume();
        return context.state === 'running';
      } catch { return false; }
    },
    play(note) {
      if (!context || context.state !== 'running' || !MELODY_NOTES[note]) return false;
      const now = context.currentTime;
      for (const [multiple, volume] of [[1, .22], [2, .045]]) {
        const oscillator = context.createOscillator(), gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = MELODY_NOTES[note] * multiple;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + .018);
        gain.gain.exponentialRampToValueAtTime(.0001, now + .7);
        oscillator.connect(gain); gain.connect(context.destination);
        const voice = {oscillator, gain}; voices.add(voice);
        oscillator.onended = () => {oscillator.disconnect(); gain.disconnect(); voices.delete(voice);};
        oscillator.start(now); oscillator.stop(now + .72);
      }
      return true;
    },
    stop() {
      for (const {oscillator, gain} of voices) {
        try {
          const now = context.currentTime;
          if (gain.gain.cancelAndHoldAtTime) gain.gain.cancelAndHoldAtTime(now);
          else { gain.gain.cancelScheduledValues(now); gain.gain.setValueAtTime(0, now); }
          gain.gain.linearRampToValueAtTime(0, now + .025);
          oscillator.stop(now + .03);
        } catch {}
      }
    },
    dispose() {
      this.stop();
      if (context && context.state !== 'closed') context.close().catch(() => {});
      context = null;
    }
  };
}

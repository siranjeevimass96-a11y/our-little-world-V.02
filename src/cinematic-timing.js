// Seconds of real playback, independent of the chosen playback speed.
export const DISSOLVE_SECONDS=1.1;
export function shouldDissolve(duration,time,rate=1){
 return Number.isFinite(duration)&&duration>0&&(duration-time)/Math.max(rate,.01)<=DISSOLVE_SECONDS;
}
export function dissolveProgress(progress,elapsed,reduced=false){
 return reduced?1:Math.min(1,progress+Math.max(0,elapsed)/DISSOLVE_SECONDS);
}

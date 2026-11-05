export function parseRange(value,size){
 if(!Number.isSafeInteger(size)||size<=0)return false;
 const match=/^bytes=(\d*)-(\d*)$/.exec(value);if(!match||(!match[1]&&!match[2]))return false;
 let start,end;if(!match[1]){const tail=Number(match[2]);if(!Number.isSafeInteger(tail)||tail<=0)return false;start=Math.max(0,size-tail);end=size-1;}else{start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),size-1):size-1;}
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start)return false;return {start,end};
}

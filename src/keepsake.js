import {KINGDOM} from './story.js';
import {asset} from './media.jsx';
export async function downloadKeepsake(state){
 const picture=new Image();picture.src=asset(KINGDOM.photos[state.favorite-1].src);await picture.decode();await document.fonts.ready;
 const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1600;const c=canvas.getContext('2d');if(!c)throw Error('This browser cannot create an image.');
 const bg=c.createLinearGradient(0,0,1200,1600);bg.addColorStop(0,'#123e3e');bg.addColorStop(1,'#061b22');c.fillStyle=bg;c.fillRect(0,0,1200,1600);c.strokeStyle='#d8b77d';c.lineWidth=3;c.strokeRect(50,50,1100,1500);c.strokeRect(66,66,1068,1468);
 c.textAlign='center';c.fillStyle='#d8b77d';c.font='20px sans-serif';c.fillText('A LITTLE WORLD, MADE JUST FOR YOU',600,130);c.fillStyle='#fff3dc';c.font='65px BirthdaySerif, Georgia';c.fillText(`Queen ${KINGDOM.nickname}`,600,225);c.font='30px BirthdaySerif, Georgia';c.fillText(`Happy ${KINGDOM.age}th Birthday, ${KINGDOM.name}`,600,280);c.font='22px sans-serif';c.fillText(KINGDOM.date,600,325);
 const box={x:150,y:390,w:900,h:820},scale=Math.min(box.w/picture.width,box.h/picture.height);c.fillStyle='#0a252b';c.fillRect(box.x,box.y,box.w,box.h);c.drawImage(picture,box.x+(box.w-picture.width*scale)/2,box.y+(box.h-picture.height*scale)/2,picture.width*scale,picture.height*scale);c.strokeStyle='#bba576';c.strokeRect(box.x-8,box.y-8,box.w+16,box.h+16);
 c.fillStyle='#fff3dc';c.font='30px BirthdaySerif, Georgia';c.fillText('You have always belonged here.',600,1300);c.font='23px sans-serif';c.fillStyle='#d8b77d';c.fillText('Woodland charm · Memory rose · Crystal star',600,1352);c.font='36px BirthdaySerif, Georgia';c.fillText(`With love, ${KINGDOM.signature}`,600,1430);c.font='18px sans-serif';c.fillText('Sunshine’s Journey to Her Kingdom',600,1483);
 const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Image export failed.')),'image/png'));const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Sunshine-Royal-Keepsake.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}

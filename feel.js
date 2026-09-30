/* Presentation consumes resolved model traces. It never rolls or awards anything. */
(function(root){
 'use strict';
 const formatter=new Intl.NumberFormat('de-DE',{maximumFractionDigits:0}),integer=n=>formatter.format(n);
 const MOTION={fast:90,normal:140,countSmall:140,countLarge:240};
 // Integral of 12t(1-t)^2: continuous velocity, stationary at both ends.
 function spinProgress(t){t=Math.max(0,Math.min(1,t));return t*t*(6+t*(-8+3*t));}
 function scoringEvents(state){
  const spin=state.lastSpin;if(!spin)return [];
  const events=[{kind:'landing',name:'Ergebnis',label:spin.result.number+' · '+({red:'ROT',black:'SCHWARZ',green:'GRÜN'}[spin.result.color]),number:spin.result.number}];
  for(const entry of state.breakdown.filter(e=>e.won)){
   const effects=entry.effects?.length?entry.effects:[{name:entry.name,label:'+'+integer(entry.points)}];
   effects.forEach((effect,index)=>events.push({kind:index===0?'bet':'chip',chipId:entry.chipId,type:entry.betType,value:entry.betValue,name:index===0?entry.name+' · '+({red:'ROT',black:'SCHWARZ',odd:'UNGERADE',even:'GERADE',low:'LOW',high:'HIGH'}[entry.betValue]??entry.betValue)+' getroffen':effect.name,label:effect.label}));
  }
  if(!spin.winners){const bets=[...new Set(state.breakdown.map(e=>({red:'ROT',black:'SCHWARZ',odd:'UNGERADE',even:'GERADE',low:'LOW',high:'HIGH'}[e.betValue]??String(e.betValue))))];events.push({kind:'miss',name:'Wette: '+bets.join(' · '),label:'Kein Treffer → +0'});}
  for(const r of state.relicTrace.filter(r=>r.triggered&&r.before!==r.after))events.push({kind:'relic',id:r.id,name:r.name,label:r.effect});
  for(const note of state.synergyTrace||[])events.push({kind:'synergy',name:note.split(' · ')[0],label:note.split(' · ').slice(1).join(' · ')});
  for(const [key,name]of [['bossPenalty','Haussteuer'],['housePenalty','Hausanteil'],['cursePenalty','Volatile']])if(spin[key])events.push({kind:'adjustment',name,label:'−'+integer(spin[key])});
  if(spin.zeroMultiplier!==1)events.push({kind:'adjustment',name:'Null-Regel',label:'×0,75'});
  events.push({kind:'total',name:spin.finalScore?'Spin gesamt':'Kein Treffer',label:'+'+integer(spin.finalScore),value:spin.finalScore});
  return events;
 }
 function create(api){
  const $=s=>document.querySelector(s),el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),touch=()=>document.documentElement.classList.contains('touch-device');
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const layer=el('div','feel-layer');document.body.append(layer);
  const ticker=el('div','score-ticker');ticker.setAttribute('role','status');ticker.setAttribute('aria-live','polite');layer.append(ticker);
  const info=el('section','chip-peek ticket');info.id='chip-peek';info.hidden=true;info.setAttribute('role','dialog');info.setAttribute('aria-label','Chip ansehen');document.body.append(info);
  let infoAnchor=null,hoverTimer,locked=false;
  function bounds(){const v=window.visualViewport;return {x:v?.offsetLeft||0,y:v?.offsetTop||0,w:v?.width||innerWidth,h:v?.height||innerHeight};}
  function position(node,anchor){
   const v=bounds(),r=anchor?.getBoundingClientRect()||{x:v.x+v.w/2,y:v.y+v.h/2,width:0,height:0,bottom:v.y+v.h/2};
   node.style.maxHeight=Math.max(80,v.h-24)+'px';
   const box=node.getBoundingClientRect();
   node.style.left=Math.max(v.x+12,Math.min(r.x+r.width/2-box.width/2,v.x+v.w-box.width-12))+'px';
   const above=r.y-box.height-12;
   node.style.top=Math.max(v.y+12,Math.min(above>=v.y+12?above:r.bottom+12,v.y+v.h-box.height-12))+'px';
  }
  function closeInfo(){info.hidden=true;infoAnchor=null;clearTimeout(hoverTimer);}
  const accents=new WeakMap();
  function punch(node,big=false){
   if(!node||motion.matches)return;
   accents.get(node)?.cancel();
   const animation=node.animate([{translate:'0 0'},{translate:'0 -'+(big?2:1)+'px',offset:.3},{translate:'0 0'}],{duration:MOTION.normal,easing:'cubic-bezier(.2,.7,.3,1)'});
   accents.set(node,animation);animation.finished.catch(()=>{}).finally(()=>{if(accents.get(node)===animation)accents.delete(node);});
  }
  const slip=el('div','effect-slip');slip.hidden=true;layer.append(slip);
  async function floatAt(anchor,name,label,duration=MOTION.normal){
   slip.replaceChildren(el('strong','',name),el('span','',label));slip.hidden=false;position(slip,anchor);
   let animation;
   try{if(!motion.matches){animation=slip.animate([{opacity:0,translate:'0 2px'},{opacity:1,translate:'0 0',offset:.2},{opacity:1,offset:.85},{opacity:0}],{duration,easing:'linear'});await animation.finished;}}
   finally{animation?.cancel();slip.hidden=true;}
  }
  async function rattle(from,to){
   const score=$('#score');if(motion.matches||Math.round(from)===Math.round(to)){score.textContent=integer(to);return;}
   const duration=to-from>=1000?MOTION.countLarge:MOTION.countSmall,start=performance.now();
   // Absolute deadlines avoid accumulating timer drift. One accent, not one per digit.
   punch(score,to-from>=500);
   for(let step=1;step<=8;step++){
    const progress=Math.min(1,Math.max(step/8,(performance.now()-start)/duration));
    score.textContent=integer(from+(to-from)*(1-Math.pow(1-progress,2)));
    if(step%3===0)api.tone(360+step*24,.009,.02);
    if(progress===1)break;
    await wait(Math.max(0,start+step*duration/8-performance.now()));
   }score.textContent=integer(to);
  }
  function eventAnchor(event){
   if(event.kind==='landing')return $('.wheel-stage');
   if(event.kind==='bet')return $('.bet-cell[data-type="'+event.type+'"][data-value="'+event.value+'"]');
   if(event.kind==='chip')return $('[data-chip="'+event.chipId+'"]');
   if(event.kind==='relic')return $('[data-relic="'+event.id+'"]');
   if(event.kind==='synergy')return $('#show-synergies');
   return $('#spin-score');
  }
  function highlight(result,index){
   document.querySelectorAll('.landing-hit').forEach(n=>n.classList.remove('landing-hit'));
   const wheel=$('#wheel').children[index];if(wheel){wheel.classList.add('landing-hit');}
   document.querySelectorAll('.bet-cell[data-type="number"][data-value="'+result.number+'"]').forEach(n=>{n.classList.add('landing-hit');});
  }
  async function scoring(resolved,from,index){
   closeInfo();locked=true;document.body.classList.add('is-scoring');highlight(resolved.lastSpin.result,index);
   const events=scoringEvents(resolved).filter(e=>e.kind!=='landing');
   ticker.textContent='Ergebnis: '+resolved.lastSpin.result.number;
   try{
    if(!motion.matches){
     const duration=Math.min(MOTION.normal,1100/events.length);
     for(const event of events){
      const source=eventAnchor(event)||$('#spin-score');
      if(event.kind==='bet'||event.kind==='relic')punch(source);
      await floatAt(source,event.name,event.label,duration);
     }
    }
    ticker.textContent='Spin: +'+integer(resolved.spinScore)+' Punkte';
    await rattle(from,resolved.score);
   }finally{slip.hidden=true;locked=false;document.body.classList.remove('is-scoring');}
  }
  async function spin(from,to,duration,count){
   closeInfo();document.querySelectorAll('.landing-hit').forEach(n=>n.classList.remove('landing-hit'));
   const wheel=$('#wheel');document.body.classList.add('is-spinning');
   try{
    if(!motion.matches)await new Promise(resolve=>{
     const start=performance.now();let raf,lastSlot=Math.floor(from*count/360),lastSound=0;
     function finish(){cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',hidden);resolve();}
     function hidden(){if(document.hidden)finish();}
     function frame(now){
      const t=motion.matches?1:Math.min(1,(now-start)/duration),angle=from+(to-from)*spinProgress(t);
      wheel.style.transform='rotate('+angle+'deg)';
      const slot=Math.floor(angle*count/360);
      if(slot!==lastSlot&&now-lastSound>=45&&t<1){api.tone(510,.008,.018);lastSound=now;}
      lastSlot=slot;
      if(t<1)raf=requestAnimationFrame(frame);else finish();
     }
     document.addEventListener('visibilitychange',hidden);raf=requestAnimationFrame(frame);
    });
   }finally{wheel.style.transform='rotate('+to+'deg)';document.body.classList.remove('is-spinning');}
   // A single pointer impact at the real stop; the wheel itself remains still.
   punch($('.wheel-pointer'));api.tone(260,.022,.055);
  }
  function rarity(chip){return chip.rarity||({Basic:'Common',Crimson:'Uncommon',Onyx:'Uncommon',Balance:'Uncommon',Sniper:'Rare',Streak:'Epic','High Roller':'Rare'})[chip.name]||'Common';}
  function inspect(chip,anchor,placed,pinned=true){
   if(locked||!anchor.isConnected)return;clearTimeout(hoverTimer);info.replaceChildren();infoAnchor=anchor;
   const head=el('header','peek-heading');head.append(el('small','stamp',rarity(chip)),el('strong','',chip.name));
   const close=el('button','quiet','✕');close.setAttribute('aria-label','Chip-Info schließen');close.onclick=()=>{closeInfo();anchor.focus({preventScroll:true});};head.append(close);info.append(head,el('p','',chip.effect));
   const betPreview=api.previewChip?.(chip.id);if(betPreview)info.append(el('p','peek-modifier',betPreview));
   if(typeof chip.streak==='number')info.append(el('p','', 'Serie: '+chip.streak));
   for(const name of chip.mutations)info.append(el('p','peek-modifier',name+' · '+api.mutations[name].description));
   if(chip.curse)info.append(el('p','peek-modifier',chip.curse.name+' · '+api.curses[chip.curse.name].description+(chip.curse.name==='Fragile'?' · '+chip.curse.losses+'/3 Verluste':'')+(chip.curse.name==='Addicted'?' · Letzte Wettart: '+(chip.curse.lastFamily||'keine'):'')));
   const synergies=api.synergies().filter(s=>s.reason.includes(chip.name)||chip.mutations.some(m=>s.reason.includes(m)));
   for(const s of synergies)info.append(el('p','peek-synergy','✦ '+s.name+' · '+s.description));
   const action=el('button','purchase-button',placed?'ZURÜCKNEHMEN':'ZUM SETZEN WÄHLEN');action.id='peek-action';action.disabled=api.getState().phase!=='ready';action.onclick=()=>{closeInfo();api.chooseChip(chip.id,placed);};info.append(action);
   info.hidden=false;info.dataset.pinned=String(pinned);position(info,anchor);
  }
  function bindChip(button,chip,placed){
   button.title+=' · Shift-Klick: Chip-Info';
   button.addEventListener('click',event=>{if(!touch()&&!event.shiftKey)return;event.preventDefault();event.stopImmediatePropagation();api.getState().selectedChip=null;inspect(chip,button,placed);},true);
   button.addEventListener('contextmenu',event=>{event.preventDefault();inspect(chip,button,placed);});
   button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&!touch()){clearTimeout(hoverTimer);hoverTimer=setTimeout(()=>inspect(chip,button,placed,false),220);}});
   button.addEventListener('pointerleave',()=>{if(info.dataset.pinned!=='true')hoverTimer=setTimeout(closeInfo,180);});
  }
  info.addEventListener('pointerenter',()=>clearTimeout(hoverTimer));info.addEventListener('pointerleave',()=>{if(info.dataset.pinned!=='true')closeInfo();});
  document.addEventListener('pointerdown',e=>{if(!info.hidden&&!info.contains(e.target)&&!infoAnchor?.contains(e.target))closeInfo();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!info.hidden){e.stopImmediatePropagation();const anchor=infoAnchor;closeInfo();anchor?.focus({preventScroll:true});}},true);
  window.addEventListener('resize',()=>{if(infoAnchor)position(info,infoAnchor);});window.visualViewport?.addEventListener('resize',()=>{if(infoAnchor)position(info,infoAnchor);});
  document.addEventListener('scroll',event=>{if(!info.hidden&&!info.contains(event.target)&&infoAnchor?.isConnected)position(info,infoAnchor);},true);
  function dialog(id,title){const d=el('dialog','ticket feel-dialog');d.id=id;d.setAttribute('aria-label',title);document.body.append(d);return d;}
  const receipt=dialog('room-receipt','Raumergebnis');
  function roomReceipt(){
   const s=api.getState();if(!['won','lost'].includes(s.phase))return;
   closeInfo();receipt.replaceChildren();receipt.append(el('small','stamp',s.phase==='won'?'ABGERECHNET ✓':'RUN BEENDET'),el('h2','',s.phase==='won'?'TISCH GESCHAFFT':'DAS HAUS GEWINNT'));
   const rows=el('dl','receipt-lines');for(const [name,value]of [['Punkte',integer(s.score)+' / '+integer(s.target)],['Raumprämie',s.phase==='won'?'+'+(api.room().payout||10)+' ◉':'0 ◉'],['Stärkster Spin',integer(s.bestSpin)]])rows.append(el('dt','',name),el('dd','',value));receipt.append(rows);
   const activated=[...new Set([...s.breakdown.filter(b=>b.won).map(b=>b.name),...s.relicTrace.filter(r=>r.triggered).map(r=>r.name),...(s.synergyTrace||[]).map(t=>t.split(' · ')[0])])];
   receipt.append(el('p','receipt-activated',activated.length?'Aktiviert: '+activated.join(' · '):'Kein Chip getroffen.'));
   const go=el('button','spin-button',s.phase==='won'?'WEITER →':'ERGEBNIS SCHLIESSEN');go.id='receipt-continue';go.onclick=()=>{receipt.close();if(api.getState().phase==='won')api.advance();};receipt.append(go);receipt.showModal();go.focus();
  }
  const synergyDialog=dialog('synergy-dialog','Aktive Synergien');
  function showSynergies(){synergyDialog.replaceChildren(el('h2','','DEIN ZUSAMMENSPIEL'));const active=api.synergies();
   if(!active.length)synergyDialog.append(el('p','','Noch keine aktive Kombination. Chip- und Relic-Effekte findest du in deinem Build.'));
   active.forEach(s=>{const card=el('article','synergy-card active');card.append(el('strong','',s.name),el('small','',s.reason),el('p','',s.description));synergyDialog.append(card);});
   const close=el('button','quiet','ZURÜCK');close.onclick=()=>synergyDialog.close();synergyDialog.append(close);synergyDialog.showModal();
  }
  const bench=dialog('chip-workbench','Chip-Werkbank');let workChip=null,workMutation='Polished';
  function renderBench(message=''){
   const s=api.getState();bench.replaceChildren();bench.append(el('small','stamp','PRÄGEWERK · EIN AUFTRAG PRO RAUM'),el('h2','','CHIP-WERKBANK'));
   const rack=el('div','bench-chips');s.chips.forEach(chip=>{const b=el('button','bench-chip '+chip.name.replaceAll(' ','-'));b.dataset.workChip=chip.id;b.setAttribute('aria-pressed',String(chip.id===workChip));b.append(el('span','chip-element '+chip.name.replaceAll(' ','-'),chip.symbol),el('small','',chip.name));b.onclick=()=>{workChip=chip.id;renderBench();};rack.append(b);});bench.append(rack);
   const chip=s.chips.find(c=>c.id===workChip),options=el('div','bench-tools');Object.entries(api.work).forEach(([name,def])=>{const b=el('button','quiet',name+' · '+def.price+' ◉');b.dataset.workMutation=name;b.setAttribute('aria-pressed',String(name===workMutation));b.onclick=()=>{workMutation=name;renderBench();};options.append(b);});bench.append(options);
   if(chip)bench.append(el('p','bench-base',chip.name+' · '+chip.effect));
   const compare=el('div','bench-comparison');
   if(chip){const before=el('section','bench-before'),after=el('section','bench-after');before.append(el('small','','VORHER'),el('strong','',chip.name),el('span','bench-symbol chip-element '+chip.name.replaceAll(' ','-'),chip.symbol),el('p','',chip.mutations.join(' · ')||'Ohne Mutation'));
    after.append(el('small','','NACHHER'),el('strong','',chip.name),el('span','bench-symbol chip-element '+chip.name.replaceAll(' ','-'),chip.symbol),el('p','',[...new Set([...chip.mutations,workMutation])].join(' · ')),el('p','',api.mutations[workMutation].description));compare.append(before,el('b','bench-arrow','→'),after);
   }else compare.append(el('p','','Lege einen Chip unter die Presse.'));bench.append(compare);
   const preview=api.previewWork(workChip,workMutation),note=el('p','work-feedback',message||(!preview.ok?preview.message:'Preis: '+preview.price+' ◉ · Guthaben: '+s.coins+' ◉'));note.setAttribute('role','status');bench.append(note);
   const actions=el('div','bench-actions'),close=el('button','quiet','ZUR WERKSTATT'),confirm=el('button','purchase-button','EINPRÄGEN · '+api.work[workMutation].price+' ◉');confirm.id='apply-chip-work';confirm.disabled=!preview.ok;confirm.onclick=()=>{const result=api.applyWork(workChip,workMutation);api.render();renderBench(result.message);if(result.ok){punch(bench.querySelector('.bench-after'),true);api.tone(380);}};close.onclick=()=>bench.close();actions.append(close,confirm);bench.append(actions);
  }
  function openBench(){workChip=null;renderBench();bench.showModal();}
  function sold(index){const card=$('[data-offer="'+index+'"]');if(card){card.classList.add('sold');const tag=card.querySelector('.price-tag');if(tag)tag.textContent='VERKAUFT';}api.tone(660);}
  return {spin,scoring,bindChip,inspect,closeInfo,showSynergies,roomReceipt,openBench,sold,punch,floatAt,get busy(){return locked;}};
 }
 const api={scoringEvents,spinProgress,create};if(typeof module!=='undefined')module.exports=api;else root.GameFeel=api;
})(typeof globalThis!=='undefined'?globalThis:this);

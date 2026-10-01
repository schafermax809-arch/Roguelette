/* First-run guidance is presentation-only and separate from run balance/saves. */
(function(root){
 'use strict';
 const KEY='roguelette-onboarding-v1';
 const concepts={
  map:['DEIN WEG','Du bist am markierten Raum. Tippe auf ein verbundenes Symbol, um den Raum direkt zu betreten. Hover oder Tastaturfokus zeigt die Vorschau. Andere Wege sind gesperrt.'],
  shop:['MÜNZEN → DEIN BUILD','Rad-, Chip- und Relic-Tokens öffnen sofort beim Kauf. Das vierte Angebot ist ein Rad-Werkzeug. Bei vollem Inventar wählst du ausdrücklich einen Ersatz.'],
  workshop:['WERKSTATT','Nimm ein kostenloses Rad-Werkzeug oder öffne die Chip-Werkbank: Chip wählen → Prägung und Vorher/Nachher prüfen → bezahlen.'],
  relic:['RELIC ENTDECKT','Relics wirken auf deinen Run, ohne Chip-Plätze zu belegen. Sie werden von links nach rechts ausgewertet. Antippen zeigt die Bedingung.'],
  mutation:['MUTATION','Ein Chip mit ✦ hat einen zusätzlichen Effekt. Tippe ihn an (Desktop: Shift-Klick), um die Mutation zu prüfen.'],
  synergy:['SYNERGIE ENTDECKT','Unter ✦ sind Sonderboni und Zusammenspiel getrennt. Ein benannter Zusammenhang allein vergibt keinen zusätzlichen Bonus.'],
  tool:['RAD-WERKZEUG','Damit veränderst du dauerhaft Felder deines Rads. Werkzeug antippen → Feld wählen → Vorschau prüfen → anwenden.'],
  boss:['BOSS-TISCH','Hier gilt eine Sonderregel. Sie steht über dem Rad. Erreiche weiterhin das Tischziel, bevor die Spins ausgehen.'],
  event:['EREIGNIS','Wähle genau eine Option. Die jeweilige Folge steht an der Auswahl; dein Build und deine Münzen bleiben Teil des Runs.'],
  endless:['ENDLESS','Das Haus ist besiegt. Du kannst mit demselben Build weiterspielen; spätere Ziele steigen. Dein normaler Sieg bleibt erhalten.']
 };
 function normalize(value){return {version:1,status:['active','completed','skipped'].includes(value?.status)?value.status:'new',replay:value?.replay===true,seen:Array.isArray(value?.seen)?value.seen.filter(k=>Object.hasOwn(concepts,k)):[]};}
 const name=(type,value)=>type==='number'?'ZAHL '+value:({red:'ROT',black:'SCHWARZ',odd:'UNGERADE',even:'GERADE',low:'LOW',high:'HIGH'}[value]||value);
 const number=n=>new Intl.NumberFormat('de-DE',{maximumFractionDigits:2}).format(n);
 function previewText(p){if(!p)return '';if(p.blocked)return 'Erst alle Greedy-Chips setzen. Chance: '+p.hits+' / '+p.total;
  const range=(a,b)=>'+'+number(a)+(a!==b?' bis +'+number(b):'');
  return 'Chance: '+p.hits+' / '+p.total+' · Treffer: '+range(p.min,p.max)+(p.multiple?' im gesamten Spin':'')+(p.varies?' (abhängig von Feld/Zusatzeffekten)':'')+(p.remaining!==undefined?' · Noch '+number(p.remaining)+' Punkte in '+p.spins+' Spins':'');
 }
 function create(api){
  const $=s=>document.querySelector(s),el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
  const context=el('aside','context-preview ticket');context.id='context-preview';context.hidden=true;context.setAttribute('aria-label','Wettvorschau');document.body.append(context);
  function contextual(id,type,value){const p=api.preview(id,type,value);if(!p)return;context.replaceChildren(el('strong','',name(type,value)),el('p','',previewText(p)));for(const status of p.states||[])context.append(el('small','',status));if(p.rule)context.append(el('small','',p.rule));const close=el('button','quiet','✕');close.setAttribute('aria-label','Wettvorschau schließen');close.onclick=()=>context.hidden=true;context.append(close);context.hidden=false;const box=$('.bets-panel').getBoundingClientRect(),rect=context.getBoundingClientRect();context.style.left=Math.max(12,Math.min(box.left,innerWidth-rect.width-12))+'px';context.style.top=Math.max(12,Math.min(box.bottom+6,innerHeight-rect.height-12))+'px';}
  document.addEventListener('scroll',event=>{if(!context.contains(event.target))context.hidden=true;},true);
  window.addEventListener('resize',()=>context.hidden=true);
  document.addEventListener('pointerdown',event=>{if(!context.contains(event.target)&&!event.target.closest('.bet-cell'))context.hidden=true;});
  let data;try{data=normalize(JSON.parse(localStorage.getItem(KEY)));}catch{data=normalize();}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data));}catch{}};
  const card=el('aside','lesson-card ticket');card.id='onboarding-card';card.hidden=true;card.setAttribute('aria-label','Spielhinweis');
  const title=el('strong'),body=el('p'),previewBox=el('div','bet-preview'),dismiss=el('button','lesson-dismiss','TUTORIAL ÜBERSPRINGEN');dismiss.type='button';card.append(title,body,previewBox,dismiss);document.body.append(card);
  title.setAttribute('role','status');
  let concept=null,candidate=null,previewClosed=false,phase='',scheduled=false;
  function clean(){document.querySelectorAll('.learn-focus').forEach(n=>n.classList.remove('learn-focus'));}
  function hide(){card.hidden=true;clean();}
  function position(){if(card.hidden||card.parentElement!==document.body)return;
   const v=visualViewport,r=$('.wheel-stage').getBoundingClientRect(),width=v?.width||innerWidth,height=v?.height||innerHeight,x=v?.offsetLeft||0,y=v?.offsetTop||0;
   card.style.width=Math.min(290,width-24)+'px';card.style.maxHeight=Math.max(100,height-24)+'px';
   const box=card.getBoundingClientRect();card.style.left=Math.max(x+12,Math.min(r.x+(r.width-box.width)/2,x+width-box.width-12))+'px';
   card.style.top=Math.max(y+12,Math.min(r.y+(r.height-box.height)/2,y+height-box.height-12))+'px';
  }
  function preview(type,value){const s=api.getState();if(s.phase!=='ready')return;const bet=s.placedBets.find(b=>b.type===type&&b.value===value),id=s.selectedChip??bet?.chip.id;if(id==null)return;
   candidate={id,type,value};previewClosed=false;contextual(id,type,value);update();
  }
  function update(){
   const s=api.getState();clean();if(s.phase!=='ready'||document.querySelector('dialog[open]'))context.hidden=true;
   if(candidate&&s.selectedChip!==candidate.id&&!s.placedBets.some(b=>b.chip.id===candidate.id&&b.type===candidate.type&&b.value===candidate.value))candidate=null;
   if(!api.started()||$('#start-screen').open){hide();return;}
   if(data.replay){hide();return;}
   if(data.status==='new'){data.status=s.history.length||s.round>1||s.currentRoom!=='entry'?'completed':'active';save();}
   if(data.status==='active'&&(s.phase==='spinning'||s.history.length)){data.status='completed';save();}
   if(phase!==s.phase){candidate=null;previewClosed=false;concept=null;phase=s.phase;}
   const dialogs=[...document.querySelectorAll('dialog[open]')],dialog=dialogs.at(-1);
   if(s.phase==='spinning'||dialog&&!['map-dialog','room-dialog','chip-workbench','workshop-dialog'].includes(dialog.id)){hide();return;}
   if(data.status==='active'&&s.phase==='ready'&&!dialog){
    document.body.append(card);card.classList.remove('lesson-inline');concept=null;card.dataset.mode='intro';
    if(s.placedBets.length){title.textContent='3 · SCHLAGE DEN TISCH';body.textContent='Erreiche '+number(s.target)+' Punkte in '+s.spinsLeft+' Spins. 4 · DREH DAS RAD – jeder Treffer zählt zum Tischziel.';$('.stats-panel').classList.add('learn-focus');$('#spin').classList.add('learn-focus');}
    else if(s.selectedChip!=null){title.textContent='2 · SETZE DEINEN CHIP';body.textContent='Außenwette: +20 bei Treffer. Einzelne Zahl: +100, aber seltener. Wähle ein Feld.';$('#outside-bets').classList.add('learn-focus');$('#number-bets').classList.add('learn-focus');}
    else{title.textContent='1 · WÄHLE EINEN CHIP';body.textContent='Chips bestimmen die Punkte deiner Wette. Wähle deinen Basic-Chip. Auf Touch: antippen, dann ZUM SETZEN WÄHLEN.';$('#chips').classList.add('learn-focus');}
    dismiss.textContent='TUTORIAL ÜBERSPRINGEN';previewBox.replaceChildren();card.hidden=false;position();return;
   }
   // One relevant concept at a time; dismissing never opens the next card immediately.
   const discoveries=[...(s.relics.length?['relic']:[]),...(s.chips.some(c=>c.mutations.length)?['mutation']:[]),...(api.synergies().length?['synergy']:[]),...(s.items.length?['tool']:[])];
   let eligible=[];
   if(dialog?.id==='map-dialog')eligible=['map'];
   else if(dialog?.id==='room-dialog')eligible=[s.phase==='complete'?'endless':s.phase,...(s.phase==='shop'?discoveries:[])];
   // Table stays clear: discoveries are explained in rooms and the handbook.
   if(!concept||!eligible.includes(concept))concept=eligible.find(k=>concepts[k]&&!data.seen.includes(k));
   if(concept){
    if(!data.seen.includes(concept)){data.seen.push(concept);save();}
    const [heading,text]=concepts[concept];title.textContent=heading;body.textContent=text;previewBox.replaceChildren();dismiss.textContent='VERSTANDEN';card.dataset.mode=concept;
    if(dialog){const heading=dialog.querySelector('h2');if(heading)heading.after(card);else dialog.prepend(card);card.classList.add('lesson-inline');card.style.cssText='';}else{document.body.append(card);card.classList.remove('lesson-inline');}
    card.hidden=false;position();return;
   }
   hide();
  }
  dismiss.onclick=()=>{if(card.dataset.mode==='intro')data.status='skipped';else if(concept){concept=null;}else previewClosed=true;candidate=null;save();hide();};
  const schedule=()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;update();});};
  document.querySelectorAll('dialog').forEach(d=>new MutationObserver(schedule).observe(d,{attributes:true,attributeFilter:['open']}));
  previewBox.addEventListener('toggle',position,true);window.visualViewport?.addEventListener('scroll',position);
  window.addEventListener('resize',position);window.addEventListener('scroll',position,{passive:true});window.visualViewport?.addEventListener('resize',position);
  // Optional replay does not alter the run or its save.
  $('#replay-intro')?.addEventListener('click',()=>{data={version:1,status:'new',replay:true,seen:[]};save();$('#help-dialog').close();hide();});
  return {update,preview,newRun(){if(data.replay){data.status='active';data.replay=false;save();}candidate=null;previewClosed=false;concept=null;update();}};
 }
 const api={normalize,previewText,create};if(typeof module!=='undefined')module.exports=api;else root.Onboarding=api;
})(typeof globalThis!=='undefined'?globalThis:this);

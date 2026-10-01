/* V2 content registry. Effects are one-pass stages, never recursive dispatch. */
(function(root){
'use strict';
const cap=(n,max)=>Math.min(max,Math.max(0,n)),prime=n=>[2,3,5,7,11,13,17].includes(n),parity=n=>n%2,range=n=>n<=9?'low':'high';
const tags={color:'Farbe',number:'Zahl',precision:'Präzision',streak:'Serie',economy:'Münzen',chaos:'Chaos',zero:'Null',wheel:'Radbau',modified:'Markiert',gilded:'Gold',hot:'Hitze',parity:'Gerade/Ungerade',range:'Low/High',comeback:'Comeback'};
const chips=[
 {name:'Velvet',symbol:'≋',rarity:'Common',tags:['color','streak'],effect:'Farbwetten: je vorherigem gleichfarbigem Treffer in diesem Raum +50 %, bis ×3.',mult:c=>c.bet.type==='outside'&&['red','black'].includes(c.bet.value)?1+.5*cap(c.room.color===c.result.color?c.room.chain:0,4):1},
 {name:'Switchback',symbol:'⇅',rarity:'Uncommon',tags:['color'],effect:'Farbwette nach einem Rot/Schwarz-Wechsel: ×2,25. Null unterbricht.',mult:c=>c.bet.type==='outside'&&['red','black'].includes(c.bet.value)&&c.previous&&c.previous.number!==0&&c.previous.color!==c.result.color?2.25:1},
 {name:'Prime Lens',symbol:'⌕',rarity:'Common',tags:['number','precision'],effect:'Zahlenwette auf 2, 3, 5, 7, 11, 13 oder 17: ×2,5.',mult:c=>c.bet.type==='number'&&prime(c.result.number)?2.5:1},
 {name:'Anchorpoint',symbol:'⌾',rarity:'Rare',tags:['number','precision','streak'],effect:'Zahlenwette: +75 % je früherem Treffer derselben Zahl in diesem Raum, bis ×4.',mult:c=>c.bet.type==='number'?1+.75*cap(c.room.numbers[c.result.number]||0,4):1},
 {name:'Dividend',symbol:'¤',rarity:'Uncommon',tags:['economy'],effect:'Außenwette: +1 Basispunkt je gehaltener Münze, höchstens +40. Münzen werden nicht ausgegeben.',add:c=>c.bet.type==='outside'?cap(c.coins,40):0},
 {name:'Prospector',symbol:'⛏',rarity:'Rare',tags:['economy','gilded','wheel'],effect:'Treffer auf vergoldetem Radfeld: ×2,5. Alle anderen Treffer normal.',mult:c=>c.pocket.mark==='Gilded'?2.5:1},
 {name:'Cinder',symbol:'♨',rarity:'Uncommon',tags:['hot','wheel','streak'],effect:'Treffer auf heißem Feld: ×2. Wirkt zusätzlich zur Hitze des Felds.',mult:c=>c.pocket.mark==='Hot'?2:1},
 {name:'Engraver',symbol:'✎',rarity:'Rare',tags:['wheel','modified','precision'],effect:'Zahlenwette: +20 % je markiertem permanenten Radfeld, bis ×3.',mult:c=>c.bet.type==='number'?1+.2*cap(c.wheel.filter(f=>f.mark).length,10):1},
 {name:'Pendulum',symbol:'±',rarity:'Common',tags:['parity'],effect:'Gerade/Ungerade-Wette: +30 Basispunkte, wenn die Parität gegenüber dem letzten Ergebnis wechselt. Null zählt nicht.',add:c=>['odd','even'].includes(c.bet.value)&&c.previous?.number>0&&c.result.number>0&&parity(c.previous.number)!==parity(c.result.number)?30:0},
 {name:'Horizon',symbol:'↔',rarity:'Common',tags:['range'],effect:'LOW/HIGH-Wette: +30 Basispunkte bei Wechsel zwischen LOW und HIGH. Null unterbricht.',add:c=>['low','high'].includes(c.bet.value)&&c.previous?.number>0&&range(c.previous.number)!==range(c.result.number)?30:0},
 {name:'Last Light',symbol:'◐',rarity:'Rare',tags:['comeback'],effect:'In den letzten zwei Spins, wenn vor dem Spin weniger als die Hälfte des Tischziels erreicht ist: ×3.',mult:c=>c.state.spinsLeft<=1&&c.state.score<c.state.target/2?3:1},
 {name:'Wildfire',symbol:'ϟ',rarity:'Epic',tags:['chaos','modified'],effect:'Auf markierten Feldern: je 50 % Chance auf ×0,5 oder ×3,5. Sonst normale Punkte.',mult:c=>c.pocket.mark?(c.random()<.5?3.5:.5):1},
 {name:'Zero Coil',symbol:'◎',rarity:'Epic',tags:['zero','streak'],unlock:'depth-zero',effect:'Zahlenwette auf 0: ×2, plus ×2 je früherem Nulltreffer in diesem Raum, bis ×8.',mult:c=>c.bet.type==='number'&&c.result.number===0?2+2*cap(c.room.numbers[0]||0,3):1}
].map(c=>({...c,build:c.tags.map(t=>tags[t]).join(' · '),special:'depth'}));
const relics={
 'Lacquer':{symbol:'▨',rarity:'Common',tags:['wheel','modified'],description:'Mindestens ein Gewinner auf einem markierten Feld: Spin ×1,35.',mult:c=>c.pocket.mark&&c.winners?1.35:1},
 'Last Ratchet':{symbol:'⏣',rarity:'Rare',tags:['comeback'],description:'Letzter Spin des Raums und mindestens ein Gewinner: Spin ×2,5.',mult:c=>c.spinsLeft===0&&c.winners?2.5:1},
 'Parity Gear':{symbol:'⚙',rarity:'Uncommon',tags:['parity'],description:'Mindestens eine Gerade/Ungerade-Wette gewinnt: Spin ×1,6.',mult:c=>c.winningFamilies.has('parity')?1.6:1},
 'Rangefinder':{symbol:'↔',rarity:'Uncommon',tags:['range'],description:'LOW oder HIGH gewinnt und eine andere Wettart gewinnt mit: Spin ×1,7.',mult:c=>c.winningFamilies.has('range')&&c.winningFamilies.size>=2?1.7:1},
 'Zero Bell':{symbol:'♧',rarity:'Rare',tags:['zero'],description:'Bei Nulltreffer: +50 % der Chip-Basiswerte als einmalige Zusatzwertung. Kein erneutes Auslösen.',add:c=>c.result.number===0&&c.winners?c.retriggerScore*.5:0},
 'Kiln':{symbol:'♨',rarity:'Rare',tags:['hot','wheel'],description:'Auf Hot-Feldern: +25 % je bisherigem erfolgreichen Treffer derselben Zahl im Raum, höchstens ×2. Kopien teilen Hitze.',mult:c=>c.pocket.mark==='Hot'&&c.winners?1+.25*cap(c.hotHeat,4):1},
 'Closed Circuit':{symbol:'◉',rarity:'Epic',tags:['wheel','precision'],description:'Höchstens acht verschiedene Zahlen im permanenten Rad und ein Gewinner: Spin ×1,8.',mult:c=>c.wheel.length>=6&&new Set(c.wheel.map(f=>f.number)).size<=8&&c.winners?1.8:1},
 'Reserve Note':{symbol:'▱',rarity:'Rare',tags:['economy','gilded'],description:'Auf Gilded-Feldern und bei mindestens 15 Münzen vor dem Spin: Spin ×1,75.',mult:c=>c.pocket.mark==='Gilded'&&c.coins>=15&&c.winners?1.75:1},
 'Mint Ledger':{symbol:'¤',rarity:'Uncommon',tags:['economy'],description:'Nach einem gewonnenen Tisch: +1 Münze je zehn gehaltenen Münzen, höchstens +4. Einmal pro Tisch.'},
 'Prism Seal':{symbol:'◇',rarity:'Epic',tags:['chaos','modified'],unlock:'depth-mods',description:'Mindestens drei verschiedene Feldmarkierungen im permanenten Rad: Treffer-Spin ×2.',mult:c=>new Set(c.wheel.map(f=>f.mark).filter(Boolean)).size>=3&&c.winners?2:1}
};
const mutations={
 Minted:{symbol:'¤',description:'Bei gewonnenem Chip auf einem Gilded-Feld: +1 Münze. Einmal pro Chip und Spin.'},
 Tempered:{symbol:'♨',description:'Ein exakter Zahlentreffer prägt ein bisher unmarkiertes permanentes Feld als Hot. Gilt ab dem nächsten Spin.'},
 Patient:{symbol:'⌛',description:'Nach einem Spin ohne gewinnende Wette: ×2 bei Treffer. Der erste Spin gibt keinen Bonus.'}
};
const pockets={
 Gilded:{symbol:'¤',label:'Vergoldet',coins:c=>c.won?2:0,description:'Bei mindestens einer gewonnenen Wette auf diesem Feld: +2 Münzen, einmal pro Spin.'},
 Hot:{symbol:'♨',label:'Heiß',score:c=>1+.25*cap(c.hotHeat,8),description:'Je vorherigem erfolgreichen Treffer derselben Zahl im Raum +25 % auf die Chip-Summe, bis ×3. Kopien teilen Hitze; nur Hot-Felder verstärken. Reset am Raumende.'},
 Boosted:{symbol:'×',label:'Verstärkt',score:()=>1.5,description:'Chip-Summe auf diesem Feld ×1,5, vor Relics.'},
 Cursed:{symbol:'⌁',label:'Verflucht',score:()=>2,coins:c=>-Math.min(1,c.coins),description:'Chip-Summe ×2, auch bei 0 Münzen. Jede Landung kostet bis zu 1 vor dem Spin vorhandene Münze; keine Schuld.'}
};
const tools=Object.fromEntries(Object.entries(pockets).map(([mark,d])=>[({Gilded:'Gild',Hot:'Heat',Boosted:'Boost',Cursed:'Hex'})[mark],{rarity:mark==='Boosted'?'Rare':'Uncommon',mark,description:d.label+': '+d.description+' Verbraucht das Werkzeug; ersetzt eine vorhandene Markierung.'}]));
const rules={
 precision:{name:'Punktlandung',description:'Zahlenwetten ×2; Außenwetten ×0,65.',chip:c=>c.bet.type==='number'?2:.65},
 parity:{name:'Zwei Takte',description:'Gerade/Ungerade ×1,75; andere Wetten ×0,8.',chip:c=>['odd','even'].includes(c.bet.value)?1.75:.8},
 range:{name:'Weite Sicht',description:'LOW/HIGH ×1,75; andere Wetten ×0,8.',chip:c=>['low','high'].includes(c.bet.value)?1.75:.8},
 color:{name:'Farbband',description:'Farbwetten: je vorherigem gleichfarbigem erfolgreichen Spin +30 %, bis ×2,5.',chip:c=>['red','black'].includes(c.bet.value)?1+.3*cap(c.room.color===c.result.color?c.room.chain:0,5):1},
 heat:{name:'Heißer Kessel',description:'Jeder erfolgreiche Feldtreffer im Raum heizt dieses Feld auf: später je +25 %, bis ×3.',spin:c=>1+.25*cap(c.heat,8)},
 toll:{name:'Goldene Maut',description:'Rot: Chip-Summe ×1,5 und −1 Münze bei Landung. Schwarz mit Gewinner: +2 Münzen.',spin:c=>c.result.color==='red'?1.5:1},
 narrow:{name:'Kleine Gesellschaft',description:'Höchstens zwei gesetzte Chips: ×1,5; sonst ×0,75 auf die Chip-Summe.',spin:c=>c.bets<=2?1.5:.75},
 spread:{name:'Breites Buch',description:'Mindestens drei gesetzte Wettarten: ×1,5; sonst ×0,8 auf die Chip-Summe.',spin:c=>c.families.size>=3?1.5:.8}
};
const synergyDefs=[
 ['gold-loop','Goldkreislauf',['economy','gilded'],'Gilded','Goldfelder erzeugen Münzen; dein Münzvorrat verstärkt passende Effekte.'],
 ['heat-engine','Glühwerk',['hot','streak'],'Hot','Cinder verdoppelt Hot-Treffer; wiederholte Treffer derselben Zahl verstärken Hot-Felder und Kiln.'],
 ['engraved','Gravierter Kreis',['modified','precision'],true,'Markierte Felder treiben deine präzisen Zahlenwetten an.'],
 ['zero-clock','Nulluhr',['zero','streak'],false,'Nulltreffer wachsen mit ihrer Serie und ihren Zusatzwertungen.'],
 ['parity-drive','Wechseltakt',['parity'],false,'Mehrere Paritäts-Effekte greifen an derselben gewonnenen Wette.'],
 ['range-drive','Horizontlinie',['range'],false,'Bereichswechsel und weitere gewinnende Wettarten verstärken sich.'],
 ['chaos-print','Unruhiger Druck',['chaos','modified'],true,'Markierte Felder öffnen hohe Zufalls-Multiplikatoren.'],
 ['late-shift','Spätschicht',['comeback'],false,'Mehrere Effekte belohnen die letzten verbleibenden Spins.'],
 ['color-thread','Samtfaden',['color','streak'],false,'Velvet wächst bei gleicher Farbe; passende Farb-Chips oder Farb-Relics verstärken diese Treffer.']
];
function itemTags(item){return item.tags||chips.find(c=>c.name===item.name)?.tags||relics[item.name]?.tags||({Drifter:['color'],Metronome:['color'],Afterimage:['wheel','precision'],Compass:['range'],Anchor:['range','parity'],Collector:['economy'],Surveyor:['range'],Crimson:['color'],Onyx:['color'],Ember:['color'],'Blood Pact':['color'],'Night Market':['color'],Streak:['streak'],Sniper:['number','precision'],Repeater:['number','precision'],Carbon:['wheel','precision'],Zero:['zero'],'Green Seal':['zero'],Phoenix:['comeback'],Balance:['parity'],'Even Steven':['parity'],Oddball:['parity'],'High Roller':['range'],'Low Rider':['range']})[item.name]||[];}
// Recipes name real compatible mechanisms; the name itself never adds a multiplier.
const recipes={
 'gold-loop':[['Dividend','Reserve Note','Mint Ledger'],['Prospector','Reserve Note']],
 'heat-engine':[['Cinder'],['Kiln']],
 'engraved':[['Engraver'],['Lacquer','Prism Seal','Closed Circuit']],
 'zero-clock':[['Zero Coil'],['Zero','Zero Bell','Green Seal']],
 'parity-drive':[['Pendulum','Balance','Oddball','Even Steven'],['Parity Gear']],
 'range-drive':[['Horizon','High Roller','Low Rider'],['Rangefinder','Compass']],
 'chaos-print':[['Wildfire'],['Lacquer','Prism Seal']],
 'late-shift':[['Last Light'],['Last Ratchet','Phoenix']],
 'color-thread':[['Velvet'],['Crimson','Onyx','Blood Pact','Night Market']]
};
function synergies(s){const inventory=[...s.chips,...s.relics],wheel=s.bossWheel||s.wheel;return synergyDefs.map(([id,name,required,mark,description])=>{const groups=recipes[id],involved=inventory.filter(i=>groups.some(g=>g.includes(i.name))),sources=[...new Set(involved.map(i=>i.name))];return {id:'depth-'+id,name,bonusType:'interaction',description:description+' Kein zusätzlicher Namensbonus.',reason:groups.map(g=>g.join(' / ')).join(' + ')+(mark?' + '+(mark===true?'markiertes Feld':mark):''),sources,sourceIds:involved.map(i=>(s.chips.includes(i)?'chip:':'relic:')+i.id),active:sources.length>=2&&groups.every(g=>sources.some(n=>g.includes(n)))&&(!mark||wheel.some(f=>mark===true?f.mark:f.mark===mark))};});}
function fresh(){return {version:1,room:{heat:{},numbers:{},color:null,chain:0,lastMiss:false},run:{zeros:0,mods:0,redOnly:true},trace:[],earned:[]};}
function ensure(s){return s.depth||(s.depth=fresh());}
function remapHeat(s,operation,index,target){const heat=ensure(s).room.heat,next={};for(const [key,value]of Object.entries(heat)){let i=Number(key);if(operation==='Delete'){if(i===index)continue;if(i>index)i--;}if(operation==='Duplicate'&&i>index)i++;if(operation==='Clone'&&i===target)continue;next[i]=value;}ensure(s).room.heat=next;}
function resetRoom(s){const d=ensure(s);d.room=fresh().room;d.run.redOnly=true;d.trace=[];}
function context(s,result,index){const d=ensure(s),pocket=s.wheel[index]||result;return {state:s,result,index,pocket,room:d.room,previous:s.history[0],coins:s.coins,wheel:s.bossWheel||s.wheel,heat:d.room.heat[index]||0,hotHeat:d.room.numbers[result.number]||0,rule:rules[s.map.flat().find(n=>n.id===s.currentRoom)?.rule]};}
function chipScore(bet,c,step){const def=chips.find(x=>x.name===bet.chip.name);c={...c,bet};if(def?.add)step(def.name,def.add(c),'add');if(def?.mult)step(def.name,def.mult(c));if(bet.chip.mutations.includes('Patient')&&c.room.lastMiss)step('Patient',2);if(c.rule?.chip)step(c.rule.name,c.rule.chip(c));}
function relicScore(name,c,score){const d=relics[name];if(!d)return null;c={pocket:{},wheel:[],coins:0,heat:0,hotHeat:0,winningFamilies:new Set(),...c};const after=(score+(d.add?.(c)||0))*(d.mult?.(c)||1);return {score:after,triggered:after!==score,effect:after===score?'Keine Bedingung erfüllt':d.description};}
function afterChips(c,points){const trace=[];const multiply=(name,n)=>{if(n!==1&&points){const before=points;points*=n;trace.push({name,before,after:points,label:'×'+String(n).replace('.',','),source:'wheel/room',trigger:'landed',depth:0});}};
 const mark=pockets[c.pocket.mark];if(mark?.score)multiply(mark.label,mark.score(c));if(c.rule?.spin)multiply(c.rule.name,c.rule.spin(c));return {points,trace};}
function finish(s,c,won,roomWon){const d=ensure(s),p=c.pocket,coinsBefore=s.coins;let money=pockets[p.mark]?.coins?.({...c,won})||0;if(c.rule===rules.toll){if(c.result.color==='red')money--;if(won&&c.result.color==='black')money+=2;}
 for(const e of s.breakdown.filter(e=>e.won)){const chip=s.chips.find(x=>x.id===e.chipId);if(!chip)continue;if(chip.mutations.includes('Minted')&&p.mark==='Gilded')money++;if(chip.mutations.includes('Tempered')&&e.betType==='number'&&!p.mark&&c.index<(s.bossWheel||s.wheel).length){p.mark='Hot';if(s.bossWheel)s.bossWheel[c.index].mark='Hot';d.run.mods++;}}
 if(roomWon&&s.relics.some(r=>r.name==='Mint Ledger'))money+=cap(Math.floor(c.coins/10),4);
 s.coins=Math.max(0,s.coins+money);if(s.coins!==coinsBefore)d.trace.push({name:'Rad & Münzen',before:0,after:0,label:(s.coins-coinsBefore>=0?'+':'')+(s.coins-coinsBefore)+' Münzen',source:'economy',trigger:'settled',depth:0});
 if(won){d.room.heat[c.index]=(d.room.heat[c.index]||0)+1;d.room.numbers[c.result.number]=(d.room.numbers[c.result.number]||0)+1;if(c.result.number===0)d.run.zeros++;d.room.chain=d.room.color===c.result.color?d.room.chain+1:1;d.room.color=c.result.color;}else{d.room.chain=0;d.room.color=null;}d.room.lastMiss=!won;
 if(s.breakdown.some(b=>b.betType!=='outside'||b.betValue!=='red'))d.run.redOnly=false;
 if(d.run.zeros>=3)d.earned.push('depth-zero');if(d.run.mods>=5)d.earned.push('depth-mods');if(roomWon&&c.coins>=30)d.earned.push('depth-vault');if(s.breakdown.some(b=>b.betType==='number'&&b.points>=500))d.earned.push('depth-precision');if(roomWon&&d.run.redOnly)d.earned.push('depth-red');d.earned=[...new Set(d.earned)];
}
const challenges=[{id:'depth-zero',name:'Nullschleife',reward:'Zero Coil',type:'chip',description:'Triff in einem Run dreimal die Null mit einer gewonnenen Wette.'},{id:'depth-mods',name:'Graviermeister',reward:'Prism Seal',type:'relic',description:'Wende in einem Run fünf Radänderungen an.'},{id:'depth-vault',name:'Volle Kasse',reward:'Kassensiegel',type:'cosmetic',description:'Gewinne einen Raum mit mindestens 30 Münzen vor dem letzten Spin.'},{id:'depth-precision',name:'Punktgenau',reward:'Präzisionssiegel',type:'cosmetic',description:'Erziele mindestens 500 Chip-Punkte mit einer Zahlenwette.'},{id:'depth-red',name:'Roter Fadenlauf',reward:'Rotes Siegel',type:'cosmetic',description:'Gewinne einen Raum ausschließlich mit ROT-Wetten.'}];
const events=[
 ['goldsmith','Der Blattgoldhändler','Gilded gegen Münzen. Oder verkaufe die Markierung.','Gilded',7],
 ['stoker','Der Heizer','Ein Feld wird Hot. Oder tausche seine Markierung gegen Münzen.','Hot',5],
 ['overprint','Der Überdruck','Ein Feld wird Boosted. Oder verkaufe seine Markierung.','Boosted',9],
 ['hex-press','Der dunkle Stempel','Cursed bringt doppelte Punkte, kostet aber Münzen bei jeder Landung.','Cursed',0]
].map(([id,name,text,mark,cost])=>({id,name,text,mark,cost,choices:[{id:'mark',label:mark+' prägen · '+cost+' Münzen',target:'field'},{id:'strip',label:'Markierung entfernen → +6 Münzen',target:'field'}]}));
events.push(
 {id:'number-deal',name:'Die Zahlenpresse',text:'Ein gewähltes Feld kopieren kostet die Hälfte deiner Münzen, mindestens 4.',choices:[{id:'duplicate',label:'Feld kopieren · halbe Kasse (mind. 4)',target:'field'}]},
 {id:'empty-seat',name:'Der leere Sitz',text:'Ein Radfeld entfernen oder für das volle Rad bezahlt werden.',choices:[{id:'delete',label:'Gewähltes Feld entfernen · −5 Münzen',target:'field'},{id:'widen',label:'Gewähltes Feld kopieren → +5 Münzen',target:'field'}]},
 {id:'coin-press',name:'Die Münzpresse',text:'Minted zahlt auf vergoldeten Feldern. Patient belohnt den nächsten Treffer nach einem Fehlspin.',choices:[{id:'Minted',label:'Minted einprägen · −6 Münzen',target:'chip'},{id:'Patient',label:'Patient einprägen · −6 Münzen',target:'chip'}]},
 {id:'temper-trade',name:'Der Temperofen',text:'Tempered macht aus Zahlentreffern heiße Felder. Du gibst dafür eine andere Mutation ab.',choices:[{id:'temper',label:'Mutation opfern → Tempered',target:'mutation'}]}
);
// Reuse existing resources: sale, token exchange, and a two-mark press.
events.find(e=>e.id==='goldsmith').choices.push({id:'relic-token',label:'Relic Token kaufen · −10 Münzen',target:null});
Object.assign(events.find(e=>e.id==='stoker'),{text:'Hitze kaufen oder eine vorhandene Markierung gegen einen garantierten Rad-Token eintauschen.'});
events.find(e=>e.id==='stoker').choices[1]={id:'strip',label:'Markierung abgeben → Rad Token',target:'field'};
Object.assign(events.find(e=>e.id==='overprint'),{text:'Zwei markierte Felder werden zu einem Boosted-Feld. Das zweite Feld verliert seine Markierung. Kostenlos; keine zusätzlichen Felder.'});
events.find(e=>e.id==='overprint').choices=[{id:'fuse',label:'Zwei Markierungen → Boosted auf gewähltem Feld',target:'field'}];
events.find(e=>e.id==='empty-seat').text='Ein Feld entfernen oder ein Feld kopieren und 5 Münzen erhalten, dafür am nächsten Tisch einen Spin verlieren.';
events.find(e=>e.id==='empty-seat').choices[1].label='Feld kopieren +5 Münzen · nächster Tisch −1 Spin';
function eventChoice(s,event,choice,o){const wheel=s.bossWheel||s.wheel,f=wheel[o.fieldIndex],chip=s.chips.find(c=>c.id===o.chipId),fail=message=>({ok:false,message});const pay=n=>{if(s.coins<n)return false;s.coins-=n;return true;};let modified=false;
 if(choice==='relic-token'){if(s.tokens.length>=3)return fail('Token-Inventar voll.');if(!pay(10))return fail('Du brauchst 10 Münzen.');s.tokens.push({id:s.nextTokenId++,name:'Relic Token'});return {ok:true,message:'Relic Token · −10 Münzen; später ausdrücklich öffnen.'};}
 if(event.id==='overprint'){if(!f?.mark)return fail('Markiertes Zielfeld wählen.');const other=wheel.findIndex((x,i)=>i!==o.fieldIndex&&x.mark);if(other<0)return fail('Zwei markierte Felder benötigt.');const old=wheel[other].mark;delete wheel[other].mark;f.mark='Boosted';ensure(s).run.mods++;return {ok:true,message:'Feld '+(o.fieldIndex+1)+' → Boosted; Feld '+(other+1)+' verliert '+old+'. Keine Münzkosten.'};}
 if(event.mark){if(!f)return fail('Radfeld wählen.');if(choice==='strip'){if(!f.mark)return fail('Dieses Feld hat keine Markierung.');if(event.id==='stoker'){if(s.tokens.length>=3)return fail('Token-Inventar voll.');s.tokens.push({id:s.nextTokenId++,name:'Rad Token'});}else s.coins+=6;delete f.mark;}else{if(f.mark===event.mark)return fail('Diese Markierung ist bereits vorhanden.');if(!pay(event.cost))return fail('Nicht genug Münzen.');f.mark=event.mark;}modified=true;}
 else if(event.id==='number-deal'||event.id==='empty-seat'){if(!f)return fail('Radfeld wählen.');if(choice==='delete'){if(wheel.length<=6)return fail('Mindestens sechs Felder müssen bleiben.');if(!pay(5))return fail('Du brauchst fünf Münzen.');remapHeat(s,'Delete',o.fieldIndex);wheel.splice(o.fieldIndex,1);}else{if(wheel.length>=38)return fail('Das Rad ist voll.');if(choice==='duplicate'&&!pay(Math.max(4,Math.ceil(s.coins/2))))return fail('Du brauchst mindestens vier Münzen.');if(choice==='widen'&&s.nextTableSpinDebt>=2)return fail('Höchstens zwei vorgemerkte fehlende Spins.');wheel.push({...f});if(choice==='widen'){s.coins+=5;s.nextTableSpinDebt++;}}modified=true;}
 else{if(!chip)return fail('Chip wählen.');const mutation=choice==='temper'?'Tempered':choice;if(chip.mutations.includes(mutation))return fail('Mutation bereits vorhanden.');if(choice==='temper'){if(!chip.mutations.includes(o.mutation)||o.mutation==='Tempered')return fail('Andere Mutation wählen.');chip.mutations=chip.mutations.filter(m=>m!==o.mutation);}else if(!pay(6))return fail('Du brauchst sechs Münzen.');chip.mutations.push(mutation);}
 if(modified){ensure(s).run.mods++;}return {ok:true,message:event.name+' · '+(choice==='strip'?(event.id==='stoker'?'Markierung entfernt → Rad Token':'Markierung entfernt → +6 Münzen'):choice==='widen'?'Gewähltes Feld kopiert · +5 Münzen · nächster Tisch −1 Spin':event.mark?event.mark+' auf Feld '+(o.fieldIndex+1)+' · −'+event.cost+' Münzen':choice==='delete'?'Gewähltes Feld entfernt · −5 Münzen':'Änderung: '+choice)};}
function validate(s,check){const d=s.depth;check(d&&d.version===1&&d.room&&d.run&&Array.isArray(d.trace)&&d.trace.length<=32&&Array.isArray(d.earned)&&d.earned.every(x=>challenges.some(c=>c.id===x)));for(const dict of [d.room.heat,d.room.numbers])check(dict&&typeof dict==='object'&&!Array.isArray(dict)&&Object.entries(dict).every(([k,v])=>/^\d{1,3}$/.test(k)&&Number.isSafeInteger(v)&&v>=0&&v<=8));check([null,'red','black','green'].includes(d.room.color)&&Number.isInteger(d.room.chain)&&d.room.chain>=0&&d.room.chain<=8&&typeof d.room.lastMiss==='boolean');check(['zeros','mods'].every(k=>Number.isSafeInteger(d.run[k])&&d.run[k]>=0&&d.run[k]<1e6)&&typeof d.run.redOnly==='boolean');check(d.trace.every(e=>typeof e.name==='string'&&e.name.length<100&&typeof e.label==='string'&&e.label.length<200&&Number.isFinite(e.before)&&Number.isFinite(e.after)));}
const api={chips:chips.map(({mult,add,...def})=>def),relics:Object.fromEntries(Object.entries(relics).map(([name,{mult,add,...def}])=>[name,def])),mutations,pockets,tools,rules,tags,events,challenges,fresh,ensure,remapHeat,resetRoom,context,chipScore,relicScore,afterChips,finish,synergies,itemTags,eventChoice,validate};if(typeof module!=='undefined')module.exports=api;else root.GameDepth=api;
})(typeof globalThis!=='undefined'?globalThis:this);
